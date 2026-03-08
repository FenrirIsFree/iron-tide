import fs from 'fs'
import path from 'path'

const GAME_DATA_DIR = path.join(process.cwd(), 'game-data')

function loadJson<T>(filename: string): T {
  const filePath = path.join(GAME_DATA_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

// ── Ship types ──
export interface Ship {
  gameId: number
  name: string
  description: string
  health: number
  speed: number
  mobility: number
  armor: number
  capacity: number
  crew: number
  rank: number
  gameType: string
  displayClass: string
  subtype: string
  coolness: number
  faction: string
  gameFaction: string
  extraUpgradeSlots: number
  costReal: number
  canBeNpc: boolean
  requiredRank: string
  canBeUsedForNpc: boolean
}

// ── Weapon types ──
export interface Weapon {
  gameId: number
  name: string
  description: string
  class: string
  category: string
  distance: number
  penetration: number
  cooldown: number
  angle: number
  scatter: number
  extra: string
  craftingType: string
  price: number
  icon: string
}

// ── NPC types ──
export interface NpcBoss {
  name: string
  type: string
  health: number
  speed: number
  hull: string
  weapons: string[]
  rewards: Record<string, unknown>[]
}

export interface NpcType {
  type: string
  description?: string
  health?: number
  speed?: number
  weapons?: string[]
  canCapture?: boolean
  [key: string]: unknown
}

export interface NpcData {
  meta: Record<string, unknown>
  npcTypes: NpcType[]
  bosses: NpcBoss[]
  proceduralNpcs: unknown[]
  npcShipNames: Record<string, string[]>
  rewardSystem: Record<string, unknown>
  captureSystem: Record<string, unknown>
  spawnMechanics: Record<string, unknown>
  [key: string]: unknown
}

// ── Game Mechanics ──
export interface MechanicCategory {
  category: string
  description?: string
  [key: string]: unknown
}

// ── Loaders ──
export function getShips(): Ship[] {
  return loadJson<Ship[]>('wiki-ships.json')
}

export function getWeapons(): Weapon[] {
  return loadJson<Weapon[]>('wiki-weapons.json')
}

export function getNpcs(): NpcData {
  return loadJson<NpcData>('wiki-npcs.json')
}

export function getCraftingRecipes(): unknown[] {
  return loadJson<unknown[]>('crafting-recipes.json')
}

export function getWorkshopRecipes(): unknown[] {
  return loadJson<unknown[]>('wiki-workshop-recipes.json')
}

export function getGameMechanics(): MechanicCategory[] {
  return loadJson<MechanicCategory[]>('wiki-game-mechanics.json')
}

export function getConsumables(): unknown[] {
  return loadJson<unknown[]>('wiki-consumables.json')
}

export function getCrewData(): unknown[] {
  return loadJson<unknown[]>('wiki-crew.json')
}
