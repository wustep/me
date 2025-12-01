// @ts-nocheck
import { cn } from "../../lib/utils"
import type { Orientation, Pet, Player, Bomb } from "./types"
import {
	CELL_WALL,
	CELL_GRASS,
	CELL_EMPTY,
	CELL_GRASS_BREAKING,
	CELL_EXPLOSION,
	PLAYER_1,
	PLAYER_2,
	PLAYER_DEAD,
	POWERUPS,
	BOMB_DELAY_DURATION,
	isPowerUp,
} from "./constants"

type GameCellProps = {
	cell: string
	x: number
	y: number
	players: {
		p1: Player
		p2: Player
	}
}

export function GameCell({ cell, x, y, players }: GameCellProps) {
	const isP1Here = players.p1.x === x && players.p1.y === y
	const isP2Here = players.p2.x === x && players.p2.y === y
	const bomb = [...players.p1.bombs, ...players.p2.bombs].find(
		(b) => b.x === x && b.y === y
	)
	const isExplosion = cell === CELL_EXPLOSION

	return (
		<div className="w-8 h-8 flex items-center justify-center relative">
			<BaseCell cell={cell} />
			{bomb && <BombCell bomb={bomb} />}
			{isExplosion && (
				<div
					className={cn(
						"absolute transition-all text-3xl animate-explosion",
						`z-[${zIndices.explosion}]`
					)}
				>
					{cell}
				</div>
			)}
			{isP1Here ? (
				<PlayerAvatar
					player={PLAYER_1}
					pet={players.p1.pet}
					alive={players.p1.alive}
					orientation={players.p1.orientation}
					isInvulnerable={Date.now() < players.p1.invulnerableUntil}
				/>
			) : isP2Here ? (
				<PlayerAvatar
					player={PLAYER_2}
					pet={players.p2.pet}
					alive={players.p2.alive}
					orientation={players.p2.orientation}
					isInvulnerable={Date.now() < players.p2.invulnerableUntil}
				/>
			) : null}
			{isPowerUp(cell) && (
				<div
					className={cn(
						"absolute transition-all text-2xl",
						`z-[${zIndices.powerup}]`
					)}
				>
					{cell}
				</div>
			)}
		</div>
	)
}

function BaseCell({ cell }: { cell: string }) {
	if (cell === CELL_GRASS_BREAKING) {
		return (
			<>
				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center text-3xl",
						`z-[${zIndices.baseCell}]`
					)}
				>
					{CELL_EMPTY}
				</div>
				<div
					className={cn(
						"absolute inset-0 flex items-center justify-center text-3xl animate-grassBreak",
						`z-[${zIndices.breakingGlass}]`
					)}
				>
					{CELL_GRASS}
				</div>
			</>
		)
	}

	return (
		<div
			className={cn(
				"absolute inset-0 flex items-center justify-center text-3xl",
				`z-[${zIndices.baseCell}]`
			)}
		>
			{cell === CELL_WALL
				? CELL_WALL
				: cell === CELL_GRASS
				? CELL_GRASS
				: CELL_EMPTY}
		</div>
	)
}

function BombCell({ bomb }: { bomb: Bomb }) {
	const elapsed = (Date.now() - bomb.startTime) / BOMB_DELAY_DURATION
	const progress = Math.min(elapsed, 1)
	return (
		<div
			className={cn(
				`absolute text-3xl transition-all duration-[${BOMB_DELAY_DURATION}]`,
				`z-[${zIndices.bomb}]`
			)}
			style={{
				filter: `
					sepia(${progress * 90}%)
					saturate(${90 + progress * 700}%)
					hue-rotate(${-progress * 120}deg)
					brightness(${90 + progress * 150}%)
				`,
			}}
		>
			💣
		</div>
	)
}

function PlayerAvatar({
	player,
	pet,
	alive,
	orientation,
	isInvulnerable,
}: {
	player: typeof PLAYER_1 | typeof PLAYER_2
	pet: Pet | null
	alive: boolean
	orientation: Orientation
	isInvulnerable: boolean
}) {
	/**
	 * Owl faces right (🦉), turtle faces left (🐢),
	 * so we flip the pet if the player is facing the opposite direction.
	 */
	const shouldFlip =
		(orientation === "left" && pet?.emoji === POWERUPS.OWL.emoji) ||
		(orientation === "right" && pet?.emoji === POWERUPS.TURTLE.emoji)

	return (
		<div
			className={cn(
				"relative flex flex-col items-center text-2xl",
				isInvulnerable ? "animate-invulnerability" : ""
			)}
		>
			<span
				className={cn(
					"relative",
					`z-[${alive ? zIndices.player : zIndices.deadPlayer}]`,
					pet ? "text-xl mb-[-1rem]" : ""
				)}
			>
				{alive ? player : PLAYER_DEAD}
			</span>
			{pet && (
				<span
					className={cn(
						"text-2xl relative",
						`z-[${zIndices.pet}]`,
						shouldFlip ? "scale-x-[-1]" : ""
					)}
				>
					{pet.emoji}
				</span>
			)}
		</div>
	)
}

/**
 * z-index values for the game cells, for when multiple objects are on top of each other.
 */
const zIndices = {
	baseCell: 0,
	breakingGlass: 1,
	bomb: 2,
	player: 3,
	pet: 4,
	powerup: 5,
	explosion: 6,
	deadPlayer: 7,
}
