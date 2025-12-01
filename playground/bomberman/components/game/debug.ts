import type { Pet } from './types'
import {
  INITIAL_BOMB_RANGE,
  INITIAL_BOMBS_MAX,
  INITIAL_SPEED,
  PETS
} from './constants'

export const DEBUG = false

export const DEBUG_STARTING_PETS: {
  P1: Pet | null
  P2: Pet | null
} = {
  P1: PETS.OWL,
  P2: PETS.TURTLE
}

export const DEBUG_STARTING_POWERUPS = {
  P1: {
    speed: INITIAL_SPEED + 1,
    bombRange: INITIAL_BOMB_RANGE + 1,
    maxBombs: INITIAL_BOMBS_MAX + 3
  },
  P2: {
    speed: INITIAL_SPEED + 1,
    bombRange: INITIAL_BOMB_RANGE + 1,
    maxBombs: INITIAL_BOMBS_MAX + 3
  }
}
