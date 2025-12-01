import type { Pet, Player, PowerUp } from "./types"

export const GRID_SIZE = 15
export const INITIAL_BOMBS_MAX = 1
export const INITIAL_BOMB_RANGE = 1
export const INITIAL_SPEED = 1

export const CELL_EMPTY = "⬜"
export const CELL_WALL = "🟫"
export const CELL_EXPLOSION = "🌸"
export const CELL_BOMB = "💣"
export const CELL_GRASS = "🟩"

const speedOwl: Pet = {
	type: "pet",
	emoji: "🦉" as const,
	name: "Speed Owl",
	effect: () => ({
		pet: speedOwl,
		speed: 2,
	}),
}

const armoredTurtle: Pet = {
	type: "pet",
	emoji: "🐢" as const,
	name: "Armored Turtle",
	effect: () => ({
		pet: armoredTurtle,
		speed: 0.8,
	}),
}

export const PETS: Record<string, Pet> = {
	OWL: speedOwl,
	TURTLE: armoredTurtle,
}

const createPowerups = () => {
	const speed: PowerUp = {
		type: "buff",
		emoji: "⚡️" as const,
		name: "Speed Boost",
		effect: (player: Player) => ({
			speed: player.speed + 0.5,
			baseSpeed: player.baseSpeed + 0.5,
		}),
	}
	const range: PowerUp = {
		type: "buff",
		emoji: "💪" as const,
		name: "Range Up",
		effect: (player: Player) => ({
			bombRange: player.bombRange + 1,
		}),
	}

	const bomb: PowerUp = {
		type: "buff",
		emoji: "➕" as const,
		name: "Extra Bomb",
		effect: (player: Player) => ({
			maxBombs: player.maxBombs + 1,
		}),
	}

	return {
		SPEED: speed,
		RANGE: range,
		BOMB: bomb,
		OWL: PETS.OWL,
		TURTLE: PETS.TURTLE,
	}
}

export const POWERUPS: Record<string, PowerUp> = createPowerups()

export const POWERUP_EMOJIS = Object.values(POWERUPS).map((p) => p.emoji)
type PowerUpEmoji = (typeof POWERUP_EMOJIS)[number]
export const isPowerUp = (cell: string): cell is PowerUpEmoji =>
	POWERUP_EMOJIS.includes(cell as PowerUpEmoji)

export const CELL_POWERUP_SPEED = POWERUPS.SPEED.emoji
export const CELL_POWERUP_RANGE = POWERUPS.RANGE.emoji
export const CELL_POWERUP_BOMB = POWERUPS.BOMB.emoji
export const CELL_POWERUP_OWL = POWERUPS.OWL.emoji
export const CELL_POWERUP_TURTLE = POWERUPS.TURTLE.emoji

/**
 * Marker for grass that is breaking. Not displayed in game.
 */
export const CELL_GRASS_BREAKING = "❎"

/**
 * Returns the powerup associated with the given emoji.
 */
export const getPowerUpFromEmoji = (cell: string): PowerUp | undefined =>
	Object.values(POWERUPS).find((p) => p.emoji === cell)

/**
 * Randomly selects a powerup or pet to spawn.
 */
export const getRandomPowerup = () => {
	const rand = Math.random()
	if (rand < POWERUP_SPAWN_PET_CHANCE) {
		// Equal chance for owl or turtle
		return Math.random() < 0.5 ? POWERUPS.OWL.emoji : POWERUPS.TURTLE.emoji
	}
	// Distribute remaining chance among other powerups
	const otherPowerups = [
		POWERUPS.SPEED.emoji,
		POWERUPS.RANGE.emoji,
		POWERUPS.BOMB.emoji,
	]
	return otherPowerups[Math.floor(Math.random() * otherPowerups.length)]
}

/**
 * Interval between attempting a randomized powerup spawn.
 */
export const POWERUP_SPAWN_INTERVAL = 10000

/**
 * Chance of spawning a powerup every {@link POWERUP_SPAWN_INTERVAL}.
 */
export const POWERUP_SPAWN_CHANCE = 0.2

/**
 * Chance of spawning a pet on a grass cell after it breaks.
 */
export const POWERUP_SPAWN_PET_CHANCE = 0.2

/**
 * Chance of spawning a powerup on a grass cell after it breaks.
 */
export const POWERUP_SPAWN_GRASS_CHANCE = 0.5
/**
 * Chance of spawning grass on a cell.
 */
export const GRASS_SPAWN_CHANCE = 0.4

export const PLAYER_1 = "😀"
export const PLAYER_2 = "😎"
export const PLAYER_DEAD = "💀"

export const BOMB_DELAY_DURATION = 1800
/**
 * Duration of an explosion in ms.
 * Keep in sync with tailwind animation duration. [#explosion-duration]
 */
export const EXPLOSION_DURATION = 400

/**
 * Duration of vulnerability after pet dies in ms.
 * Keep in sync with tailwind animation duration. [#invulnerability-duration]
 */
export const INVULNERABILITY_DURATION = 2000

/**
 * Duration of grass breaking animation in ms.
 * Keep in sync with tailwind animation duration. [#grass-break-duration]
 */
export const GRASS_BREAK_DURATION = 250

/**
 * Duration of time before an explosion triggers another explosion in ms.
 */
export const CHAIN_EXPLOSION_DELAY = 50
