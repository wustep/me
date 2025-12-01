export type Orientation = "left" | "right"

export type Player = {
	x: number
	y: number
	bombs: Bomb[]
	maxBombs: number
	bombRange: number
	speed: number
	alive: boolean
	lastMove: number
	kills: number
	pet: Pet | null
	baseSpeed: number
	orientation: Orientation
	invulnerableUntil: number
}

export type Bomb = {
	x: number
	y: number
	timer: number
	range: number
	startTime: number
}

export type PowerUp = {
	type: "buff" | "pet"
	emoji: string
	name: string
	effect: (player: Player) => Partial<Player>
}

export type Pet = PowerUp & {
	type: "pet"
}
