// @ts-nocheck
"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Badge } from "../ui/badge"
import GameOverAlert from "./GameOverAlert"
import SettingsPanel from "./SettingsPanel"

import {
	GRID_SIZE,
	INITIAL_BOMBS_MAX,
	INITIAL_BOMB_RANGE,
	INITIAL_SPEED,
	CELL_EMPTY,
	CELL_WALL,
	CELL_EXPLOSION,
	CELL_BOMB,
	CELL_GRASS,
	CELL_POWERUP_SPEED,
	CELL_POWERUP_RANGE,
	CELL_POWERUP_BOMB,
	CELL_POWERUP_OWL,
	CELL_POWERUP_TURTLE,
	POWERUPS,
	POWERUP_SPAWN_CHANCE,
	POWERUP_SPAWN_INTERVAL,
	POWERUP_SPAWN_GRASS_CHANCE,
	GRASS_SPAWN_CHANCE,
	POWERUP_SPAWN_PET_CHANCE,
	EXPLOSION_DURATION,
	BOMB_DELAY_DURATION,
	INVULNERABILITY_DURATION,
	CELL_GRASS_BREAKING,
	getPowerUpFromEmoji,
	POWERUP_EMOJIS,
	GRASS_BREAK_DURATION,
	CHAIN_EXPLOSION_DELAY,
} from "./constants"

import { DEBUG, DEBUG_STARTING_PETS, DEBUG_STARTING_POWERUPS } from "./debug"
import { GameCell } from "./GameCell"
import { Pet } from "./types"

/**
 * State of keys held down.
 */
type KeyState = {
	[key: string]: boolean
}

type Direction = {
	key: string
	dx: number
	dy: number
}

const PLAYER_1_CONTROLS: Direction[] = [
	{ key: "w", dx: 0, dy: -1 },
	{ key: "s", dx: 0, dy: 1 },
	{ key: "a", dx: -1, dy: 0 },
	{ key: "d", dx: 1, dy: 0 },
]

const PLAYER_2_CONTROLS: Direction[] = [
	{ key: "arrowup", dx: 0, dy: -1 },
	{ key: "arrowdown", dx: 0, dy: 1 },
	{ key: "arrowleft", dx: -1, dy: 0 },
	{ key: "arrowright", dx: 1, dy: 0 },
]

/**
 * The way a player is facing.
 * Used to align the player's sprite.
 */
export type Orientation = "left" | "right"

/**
 * Player state.
 */
type Player = {
	// Game-specific state.
	x: number
	y: number
	bombs: Bomb[]
	maxBombs: number
	bombRange: number
	speed: number
	alive: boolean
	lastMove: number
	pet: Pet | null
	baseSpeed: number
	orientation: Orientation
	invulnerableUntil: number
	// Stats state that persists after death.
	kills: number
}

/**
 * Bomb state.
 */
type Bomb = {
	x: number
	y: number
	timer: number
	range: number
	startTime: number
}

type Explosion = {
	coords: [number, number][]
	clearTime: number
}

type PowerupSpawn = {
	x: number
	y: number
	spawnTime: number
}

export default function Game() {
	const [keys, setKeys] = useState<KeyState>({})
	const [grid, _setGrid] = useState<string[][]>(
		Array(GRID_SIZE)
			.fill(null)
			.map(() => Array(GRID_SIZE).fill(CELL_EMPTY))
	)
	const gridRef = useRef<string[][]>(grid)
	const setGrid = useCallback(
		(newGrid: string[][] | ((prev: string[][]) => string[][])) => {
			const updatedGrid =
				typeof newGrid === "function" ? newGrid(gridRef.current) : newGrid
			_setGrid(updatedGrid)
			gridRef.current = updatedGrid
		},
		[]
	)

	const [players, _setPlayers] = useState<{ p1: Player; p2: Player }>({
		p1: {
			x: 1,
			y: 1,
			bombs: [],
			maxBombs: INITIAL_BOMBS_MAX,
			bombRange: INITIAL_BOMB_RANGE,
			speed: INITIAL_SPEED,
			alive: true,
			lastMove: 0,
			kills: 0,
			pet: null,
			baseSpeed: INITIAL_SPEED,
			orientation: "right",
			invulnerableUntil: 0,
		},
		p2: {
			x: GRID_SIZE - 2,
			y: GRID_SIZE - 2,
			bombs: [],
			maxBombs: INITIAL_BOMBS_MAX,
			bombRange: INITIAL_BOMB_RANGE,
			speed: INITIAL_SPEED,
			alive: true,
			lastMove: 0,
			kills: 0,
			pet: null,
			baseSpeed: INITIAL_SPEED,
			orientation: "left",
			invulnerableUntil: 0,
		},
	})
	const playersRef = useRef<{ p1: Player; p2: Player }>(players)
	const setPlayers = useCallback(
		(
			newPlayers:
				| { p1: Player; p2: Player }
				| ((prev: { p1: Player; p2: Player }) => { p1: Player; p2: Player })
		) => {
			const updatedPlayers =
				typeof newPlayers === "function"
					? newPlayers(playersRef.current)
					: newPlayers
			_setPlayers(updatedPlayers)
			playersRef.current = updatedPlayers
		},
		[]
	)

	const [gameOver, setGameOver] = useState(false)
	const [, setTick] = useState(0)
	const [, setExplosions] = useState<Explosion[]>([])
	const [, setPendingPowerups] = useState<PowerupSpawn[]>([])
	const [showAlert, setShowAlert] = useState(false)
	const [debugMode, setDebugMode] = useState(DEBUG)

	// Key state management
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase()
			// Special handling for right shift
			if (
				e.key === "Shift" &&
				e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT
			) {
				setKeys((prev) => ({ ...prev, rightshift: true }))
			} else {
				setKeys((prev) => ({ ...prev, [key]: true }))
			}
			e.preventDefault()
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase()
			// Special handling for right shift
			if (
				e.key === "Shift" &&
				e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT
			) {
				setKeys((prev) => ({ ...prev, rightshift: false }))
			} else {
				setKeys((prev) => ({ ...prev, [key]: false }))
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		window.addEventListener("keyup", handleKeyUp)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			window.removeEventListener("keyup", handleKeyUp)
		}
	}, [])

	const movePlayer = useCallback(
		(player: "p1" | "p2", dx: number, dy: number) => {
			const currentTime = Date.now()
			if (!playersRef.current[player].alive) return

			const moveDelay = 200 / playersRef.current[player].speed
			if (currentTime - playersRef.current[player].lastMove < moveDelay) return

			const { x, y } = playersRef.current[player]
			const newX = Math.max(0, Math.min(GRID_SIZE - 1, x + dx))
			const newY = Math.max(0, Math.min(GRID_SIZE - 1, y + dy))

			// Collision handling
			const otherPlayer = player === "p1" ? "p2" : "p1"
			if (
				playersRef.current[otherPlayer].x === newX &&
				playersRef.current[otherPlayer].y === newY
			)
				return

			const targetCell = gridRef.current[newY][newX]
			// Don't allow colliding, but still change direction.
			if (
				targetCell === CELL_WALL ||
				targetCell === CELL_BOMB ||
				targetCell === CELL_GRASS ||
				targetCell === CELL_GRASS_BREAKING
			) {
				setPlayers((prev) => ({
					...prev,
					[player]: {
						...prev[player],
						...(dx !== 0 ? { orientation: dx < 0 ? "left" : "right" } : {}),
					},
				}))
				return
			}

			if (isPowerUp(targetCell)) {
				setPlayers((prev) => {
					const powerUp = getPowerUpFromEmoji(targetCell)
					const upgrade = powerUp?.effect(prev[player])

					return {
						...prev,
						[player]: {
							...prev[player],
							...upgrade,
						},
					}
				})
			}

			setGrid((prev) => {
				const newGrid = [...prev]
				if (isPowerUp(targetCell)) {
					newGrid[newY][newX] = CELL_EMPTY
				}
				return newGrid
			})

			setPlayers((prev) => ({
				...prev,
				[player]: {
					...prev[player],
					x: newX,
					y: newY,
					lastMove: currentTime,
					...(dx !== 0 ? { orientation: dx < 0 ? "left" : "right" } : {}),
				},
			}))
		},
		[setGrid, setPlayers]
	)

	const placeBomb = useCallback(
		(player: "p1" | "p2") => {
			const { x, y, bombs, maxBombs, bombRange, alive } =
				playersRef.current[player]
			if (bombs.length >= maxBombs || !alive) return

			if (gridRef.current[y][x] === CELL_BOMB) return

			const newBomb = {
				x,
				y,
				timer: 3,
				range: bombRange,
				startTime: Date.now(),
			}
			setPlayers((prev) => ({
				...prev,
				[player]: { ...prev[player], bombs: [...prev[player].bombs, newBomb] },
			}))

			setGrid((prev) => {
				const newGrid = [...prev]
				newGrid[y][x] = CELL_BOMB
				return newGrid
			})

			const explodeBomb = (player: "p1" | "p2", bomb: Bomb) => {
				// Bomb was already triggered or was deleted,
				// either by a chain reaction or game reset.
				if (
					!Object.values(playersRef.current).some((p) =>
						p.bombs.find((b) => b === bomb)
					)
				) {
					return
				}

				const currentTime = Date.now()

				const { x, y, range } = bomb
				const explosionCoords: Array<[number, number]> = []
				const triggeredBombs: { player: "p1" | "p2"; bomb: Bomb }[] = []
				const powerupSpawns: Array<{ x: number; y: number }> = []

				setPlayers((prev) => ({
					...prev,
					[player]: {
						...prev[player],
						bombs: prev[player].bombs.filter((b) => b !== bomb),
					},
				}))

				const directions = [
					[0, 1],
					[0, -1],
					[1, 0],
					[-1, 0],
				]

				setGrid((prev) => {
					const newGrid = [...prev]

					if (newGrid[y][x] !== CELL_WALL) {
						newGrid[y][x] = CELL_EXPLOSION
						explosionCoords.push([x, y])
					}

					directions.forEach(([dx, dy]) => {
						for (let i = 1; i <= range; i++) {
							const newX = x + dx * i
							const newY = y + dy * i

							if (
								newX < 0 ||
								newX >= GRID_SIZE ||
								newY < 0 ||
								newY >= GRID_SIZE ||
								newGrid[newY][newX] === CELL_WALL
							) {
								break
							}

							// Check for bombs to trigger chain reaction
							if (newGrid[newY][newX] === CELL_BOMB) {
								const p1Bomb = playersRef.current.p1.bombs.find(
									(b) => b.x === newX && b.y === newY
								)
								const p2Bomb = playersRef.current.p2.bombs.find(
									(b) => b.x === newX && b.y === newY
								)

								if (p1Bomb) {
									triggeredBombs.push({ player: "p1", bomb: p1Bomb })
								} else if (p2Bomb) {
									triggeredBombs.push({ player: "p2", bomb: p2Bomb })
								}
							}

							// Handle grass - if it's grass, start break animation
							if (newGrid[newY][newX] === CELL_GRASS) {
								newGrid[newY][newX] = CELL_GRASS_BREAKING
								// Queue this location for potential powerup spawn and clearing
								if (Math.random() <= POWERUP_SPAWN_GRASS_CHANCE) {
									powerupSpawns.push({ x: newX, y: newY })
								}
								// Schedule the actual clearing
								setTimeout(() => {
									setGrid((prev) => {
										const newGrid = [...prev]
										if (newGrid[newY][newX] === CELL_GRASS_BREAKING) {
											newGrid[newY][newX] = CELL_EMPTY
										}
										return newGrid
									})
								}, GRASS_BREAK_DURATION) // Match this with animation duration
								break // Stop the explosion in this direction
							}

							newGrid[newY][newX] = CELL_EXPLOSION
							explosionCoords.push([newX, newY])
						}
					})

					return newGrid
				})

				const newPlayers = { ...playersRef.current }
				let someoneKilled = false

				explosionCoords.forEach(([ex, ey]) => {
					if (
						playersRef.current.p1.x === ex &&
						playersRef.current.p1.y === ey &&
						playersRef.current.p1.alive &&
						currentTime > playersRef.current.p1.invulnerableUntil
					) {
						if (newPlayers.p1.pet) {
							// Remove pet, reset speed, and add invulnerability
							newPlayers.p1 = {
								...newPlayers.p1,
								pet: null,
								speed: newPlayers.p1.baseSpeed,
								invulnerableUntil: currentTime + INVULNERABILITY_DURATION,
							}
						} else {
							newPlayers.p1.alive = false
							if (player === "p2") {
								newPlayers.p2.kills++
							}
							someoneKilled = true
						}
					}
					if (
						playersRef.current.p2.x === ex &&
						playersRef.current.p2.y === ey &&
						playersRef.current.p2.alive &&
						currentTime > playersRef.current.p2.invulnerableUntil
					) {
						if (newPlayers.p2.pet) {
							// Remove pet, reset speed, and add invulnerability
							newPlayers.p2 = {
								...newPlayers.p2,
								pet: null,
								speed: newPlayers.p2.baseSpeed,
								invulnerableUntil: currentTime + INVULNERABILITY_DURATION,
							}
						} else {
							newPlayers.p2.alive = false
							if (player === "p1") {
								newPlayers.p1.kills++
							}
							someoneKilled = true
						}
					}
				})

				if (someoneKilled) {
					setPlayers(newPlayers)
					setGameOver(true)
					// Add delay before showing alert
					setTimeout(() => {
						setShowAlert(true)
					}, 1000)
					return
				}

				// Trigger chain explosions with a small delay
				triggeredBombs.forEach(({ player, bomb }) => {
					setTimeout(() => {
						explodeBomb(player, bomb)
					}, CHAIN_EXPLOSION_DELAY)
				})

				// Spawn powerups after explosion clears
				const clearTime = Date.now() + EXPLOSION_DURATION
				setExplosions((prev) => [
					...prev,
					{ coords: explosionCoords, clearTime },
				])

				// Queue powerup spawns
				if (powerupSpawns.length > 0) {
					setPendingPowerups((prev) => [
						...prev,
						...powerupSpawns.map((spawn) => ({
							...spawn,
							spawnTime: clearTime,
						})),
					])
				}
			}

			setTimeout(() => {
				explodeBomb(player, newBomb)
			}, BOMB_DELAY_DURATION)
		},
		[setPlayers, setGrid, gameOver]
	)

	// Game loop for continuous movement
	useEffect(() => {
		if (gameOver) return

		const gameLoop = setInterval(() => {
			// Handle Player 1 movement
			PLAYER_1_CONTROLS.forEach((control) => {
				if (keys[control.key]) {
					movePlayer("p1", control.dx, control.dy)
				}
			})

			// Handle Player 2 movement
			PLAYER_2_CONTROLS.forEach((control) => {
				if (keys[control.key]) {
					movePlayer("p2", control.dx, control.dy)
				}
			})

			// Handle bomb placement
			if (keys["q"]) placeBomb("p1")
			if (keys["rightshift"]) placeBomb("p2")

			// Handle explosions and powerups
			const currentTime = Date.now()

			// Check for players in explosions
			setExplosions((prev) => {
				prev.forEach((explosion) => {
					explosion.coords.forEach(([ex, ey]) => {
						const currentTime = Date.now()

						// Check Player 1
						if (
							playersRef.current.p1.x === ex &&
							playersRef.current.p1.y === ey &&
							playersRef.current.p1.alive &&
							currentTime > playersRef.current.p1.invulnerableUntil
						) {
							if (playersRef.current.p1.pet) {
								setPlayers((prev) => ({
									...prev,
									p1: {
										...prev.p1,
										pet: null,
										speed: prev.p1.baseSpeed,
										invulnerableUntil: currentTime + INVULNERABILITY_DURATION,
									},
								}))
							} else {
								setPlayers((prev) => ({
									...prev,
									p1: { ...prev.p1, alive: false },
								}))
								setGameOver(true)
								setTimeout(() => setShowAlert(true), 1000)
							}
						}
						// Check Player 2
						if (
							playersRef.current.p2.x === ex &&
							playersRef.current.p2.y === ey &&
							playersRef.current.p2.alive &&
							currentTime > playersRef.current.p2.invulnerableUntil
						) {
							if (playersRef.current.p2.pet) {
								setPlayers((prev) => ({
									...prev,
									p2: {
										...prev.p2,
										pet: null,
										speed: prev.p2.baseSpeed,
										invulnerableUntil: currentTime + INVULNERABILITY_DURATION,
									},
								}))
							} else {
								setPlayers((prev) => ({
									...prev,
									p2: { ...prev.p2, alive: false },
								}))
								setGameOver(true)
								setTimeout(() => setShowAlert(true), 1000)
							}
						}
					})
				})

				// Clear expired explosions
				const expired = prev.filter((e) => currentTime >= e.clearTime)
				if (expired.length > 0) {
					setGrid((grid) => {
						const newGrid = [...grid]
						expired.forEach((explosion) => {
							explosion.coords.forEach(([x, y]) => {
								if (newGrid[y][x] === CELL_EXPLOSION) {
									newGrid[y][x] = CELL_EMPTY
								}
							})
						})
						return newGrid
					})
				}
				return prev.filter((e) => currentTime < e.clearTime)
			})

			// Handle pending powerup spawns
			setPendingPowerups((prev) => {
				const readyToSpawn = prev.filter((p) => currentTime >= p.spawnTime)
				if (readyToSpawn.length > 0) {
					setGrid((grid) => {
						const newGrid = [...grid]
						readyToSpawn.forEach(({ x, y }) => {
							if (newGrid[y][x] === CELL_EMPTY) {
								newGrid[y][x] = getRandomPowerup()
							}
						})
						return newGrid
					})
				}
				return prev.filter((p) => currentTime < p.spawnTime)
			})

			setTick((t) => t + 1)
		}, 16)

		return () => clearInterval(gameLoop)
	}, [keys, gameOver, placeBomb, movePlayer, setGrid, setPlayers])

	const resetGame = useCallback(() => {
		const newGrid = Array(GRID_SIZE)
			.fill(null)
			.map(() => Array(GRID_SIZE).fill(CELL_EMPTY))

		// Initialize walls and grass
		for (let i = 0; i < GRID_SIZE; i++) {
			for (let j = 0; j < GRID_SIZE; j++) {
				if (i % 2 === 0 && j % 2 === 0) {
					newGrid[i][j] = CELL_WALL
				} else if (
					!(
						(i === 1 && j === 1) ||
						(i === 1 && j === 2) ||
						(i === 2 && j === 1) ||
						(i === 2 && j === 2) ||
						(i === GRID_SIZE - 2 && j === GRID_SIZE - 2) ||
						(i === GRID_SIZE - 2 && j === GRID_SIZE - 3) ||
						(i === GRID_SIZE - 3 && j === GRID_SIZE - 2) ||
						(i === GRID_SIZE - 3 && j === GRID_SIZE - 3)
					) &&
					Math.random() <= GRASS_SPAWN_CHANCE
				) {
					newGrid[i][j] = CELL_GRASS
				}
			}
		}

		// Clear starting positions
		newGrid[1][1] = CELL_EMPTY
		newGrid[GRID_SIZE - 2][GRID_SIZE - 2] = CELL_EMPTY

		setGrid(newGrid)
		setExplosions([]) // Clear all explosions
		setPendingPowerups([]) // Clear pending powerups
		setPlayers((players) => ({
			p1: {
				x: 1,
				y: 1,
				bombs: [],
				maxBombs: debugMode
					? DEBUG_STARTING_POWERUPS.P1.maxBombs
					: INITIAL_BOMBS_MAX,
				bombRange: debugMode
					? DEBUG_STARTING_POWERUPS.P1.bombRange
					: INITIAL_BOMB_RANGE,
				speed: debugMode ? DEBUG_STARTING_POWERUPS.P1.speed : INITIAL_SPEED,
				alive: true,
				lastMove: 0,
				kills: players.p1.kills,
				pet: debugMode ? DEBUG_STARTING_PETS.P1 : null,
				baseSpeed: debugMode ? DEBUG_STARTING_POWERUPS.P1.speed : INITIAL_SPEED,
				orientation: "right",
				invulnerableUntil: 0,
			},
			p2: {
				x: GRID_SIZE - 2,
				y: GRID_SIZE - 2,
				bombs: [],
				maxBombs: debugMode
					? DEBUG_STARTING_POWERUPS.P2.maxBombs
					: INITIAL_BOMBS_MAX,
				bombRange: debugMode
					? DEBUG_STARTING_POWERUPS.P2.bombRange
					: INITIAL_BOMB_RANGE,
				speed: debugMode ? DEBUG_STARTING_POWERUPS.P2.speed : INITIAL_SPEED,
				alive: true,
				lastMove: 0,
				kills: players.p2.kills,
				pet: debugMode ? DEBUG_STARTING_PETS.P2 : null,
				baseSpeed: debugMode ? DEBUG_STARTING_POWERUPS.P2.speed : INITIAL_SPEED,
				orientation: "left",
				invulnerableUntil: 0,
			},
		}))
		setGameOver(false)
		setShowAlert(false)
	}, [setGrid, setPlayers, debugMode])

	useEffect(() => {
		resetGame()
	}, [resetGame])

	// Spawn powerups
	useEffect(() => {
		const spawnPowerup = setInterval(() => {
			if (Math.random() <= POWERUP_SPAWN_CHANCE) {
				const x = Math.floor(Math.random() * GRID_SIZE)
				const y = Math.floor(Math.random() * GRID_SIZE)
				setGrid((prev) => {
					const newGrid = [...prev]
					console.log(newGrid[y][x])
					if (newGrid[y][x] === CELL_EMPTY) {
						newGrid[y][x] = getRandomPowerup()
					}
					return newGrid
				})
			}
			// TODO: make this spawn during a frame instead...
		}, POWERUP_SPAWN_INTERVAL)
		return () => clearInterval(spawnPowerup)
	}, [setGrid])

	return (
		<div className="space-y-4">
			<div className="flex justify-between mb-4">
				<div className="space-y-2">
					<Badge variant={players.p1.alive ? "default" : "destructive"}>
						Player 1: WASD + Q (bomb)
					</Badge>
					<div className="text-sm">
						<PlayerStats {...players.p1} />
					</div>
				</div>
				<SettingsPanel
					debug={debugMode}
					onDebugChange={(enabled) => {
						setDebugMode(enabled)
					}}
					onReset={resetGame}
				/>
				<div className="space-y-2">
					<Badge variant={players.p2.alive ? "default" : "destructive"}>
						Player 2: Arrows + Right Shift (bomb)
					</Badge>
					<div className="text-sm text-right">
						<PlayerStats {...players.p2} />
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<GameGrid grid={grid} players={players} />
			</div>

			{gameOver && (
				<GameOverAlert
					showAlert={showAlert}
					p1Alive={players.p1.alive}
					p2Alive={players.p2.alive}
					onReset={resetGame}
				/>
			)}
		</div>
	)
}

const isPowerUp = (cell: string): boolean => {
	return POWERUP_EMOJIS.includes(cell)
}

type PlayerStatsProps = {
	speed: number
	bombRange: number
	kills: number
	pet: Pet | null
}

function PlayerStats({ speed, bombRange, kills, pet }: PlayerStatsProps) {
	return (
		<>
			Speed:{" "}
			<span
				className={
					pet?.emoji === POWERUPS.OWL.emoji
						? "text-amber-700 font-semibold"
						: pet?.emoji === POWERUPS.TURTLE.emoji
						? "text-green-700 font-semibold"
						: ""
				}
			>
				{speed.toFixed(1)}x
			</span>{" "}
			| Bomb Range: {bombRange}x1 | Kills: {kills}
		</>
	)
}

type GameGridProps = {
	grid: string[][]
	players: {
		p1: Player
		p2: Player
	}
}

function GameGrid({ grid, players }: GameGridProps) {
	return (
		<div className="grid grid-cols-1 gap-0 bg-secondary p-4 rounded-lg overflow-auto max-h-[80vh]">
			{grid.map((row, y) => (
				<div key={y} className="flex">
					{row.map((cell, x) => (
						<GameCell
							key={`${x}-${y}`}
							cell={cell}
							x={x}
							y={y}
							players={players}
						/>
					))}
				</div>
			))}
		</div>
	)
}

const getRandomPowerup = () => {
	const rand = Math.random()
	if (rand < POWERUP_SPAWN_PET_CHANCE) {
		// Equal chance for owl or turtle
		return Math.random() < 0.5 ? CELL_POWERUP_OWL : CELL_POWERUP_TURTLE
	}
	// Distribute remaining 90% among other powerups
	const otherPowerups = [
		CELL_POWERUP_SPEED,
		CELL_POWERUP_RANGE,
		CELL_POWERUP_BOMB,
	]
	return otherPowerups[Math.floor(Math.random() * otherPowerups.length)]
}
