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
  coolness: string
  faction: string
  gameFaction: string
  extraUpgradeSlots: number
  costReal: number
  canBeNpc: boolean
  requiredRank: number
  canBeUsedForNpc: boolean
}

// ── Weapon types ──
export interface Weapon {
  // Identity
  name: string
  gameId: string
  type: string          // Cannon, Long Cannon, Carronade, Bombard, Mortar, Special
  weightClass: string   // Light, Medium, Heavy, Mortar

  // Core stats
  damage: number        // per-shot damage (numeric only)
  damageDisplay: string // e.g. "34 × 8" or "80/sec"
  reload: number        // seconds
  range: number         // max range
  rangeMin?: number     // mortar min range
  angle: number         // firing arc degrees
  scatter: number       // accuracy spread
  dps: number           // computed damage per second

  // Extra properties
  projectileSpeed: number // speed multiplier (1.0 = normal)
  splashRadius?: number
  overheat?: number       // shots until overheat
  preparation?: number    // mortar prep time multiplier
  structureDamage?: string // e.g. "x2"
  placementRestriction?: string // e.g. "Bow or Stern only"
  shots: number           // multi-shot count (1 for single)

  // Acquisition
  acquisition: string   // "Craftable", "Gold Purchase", "Premium"
  price: number         // gold price
  isPremium: boolean
  craftingRecipe?: Record<string, number>  // resource name -> amount

  // Legacy (for compatibility)
  description: string
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

// ── Slug Helper ──
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Loaders ──
export function getShips(): Ship[] {
  return loadJson<Ship[]>('wiki-ships.json')
}

export function getAllShipSlugs(): string[] {
  return getShips().map(s => toSlug(s.name))
}

export function getShipBySlug(slug: string): Ship | undefined {
  return getShips().find(s => toSlug(s.name) === slug)
}

// ── Weapon crafting cost calculator (from decompiled Gameplay.CannonCraftCost) ──
const RESOURCE_MEDIUM_COSTS: Record<number, [string, number]> = {
  2: ['Rum', 8], 4: ['Iron', 3], 11: ['Copper', 30],
  14: ['Bronze', 390], 23: ['Volcanic Ore', 30], 37: ['Battle Mark', 200],
}
const WEAPON_RECIPE_TEMPLATES: Record<string, [number, number][]> = {
  Light:  [[4, 60], [2, 40]],
  Medium: [[4, 45], [2, 20], [11, 35]],
  Heavy:  [[4, 30], [23, 10], [37, 15], [14, 45]],
}

function computeWeaponCraftRecipe(totalGold: number, category: string): Record<string, number> {
  const template = WEAPON_RECIPE_TEMPLATES[category]
  if (!template) return {}

  const amounts = new Array(template.length).fill(0)
  let minCostIdx = 0
  let minCost = RESOURCE_MEDIUM_COSTS[template[0][0]][1]
  let totalValue = 0

  for (let i = 0; i < template.length; i++) {
    const [resId, pct] = template[i]
    const medCost = RESOURCE_MEDIUM_COSTS[resId][1]
    if (medCost < minCost) { minCost = medCost; minCostIdx = i }
    if (pct > 0 && medCost > 0) {
      amounts[i] = Math.floor(totalGold * pct / 100 / medCost)
      totalValue += amounts[i] * medCost
    }
  }

  const remainder = totalGold - totalValue
  if (Math.abs(remainder) > 0.0001) {
    const cheapCost = RESOURCE_MEDIUM_COSTS[template[minCostIdx][0]][1]
    const adjust = Math.round(remainder / cheapCost)
    const newTotal = totalValue + adjust * cheapCost
    if (Math.abs(totalGold - newTotal) <= Math.abs(remainder)) {
      amounts[minCostIdx] += adjust
    }
  }

  const recipe: Record<string, number> = {}
  for (let i = 0; i < template.length; i++) {
    if (amounts[i] > 0) {
      recipe[RESOURCE_MEDIUM_COSTS[template[i][0]][0]] = amounts[i]
    }
  }
  return recipe
}

function getWeaponCraftCategory(w: Record<string, unknown>): string {
  const wtype = w.type as string || ''
  if (wtype === 'Mortar') {
    const cal = w.caliber as number | null
    if (cal === 6 || cal === 7) return 'Light'
    if (cal === 8 || cal === 9) return 'Medium'
    if (cal === 10 || cal === 11) return 'Heavy'
    return 'Medium'
  }
  return (w.weightClass as string) || ''
}

export function getWeapons(): Weapon[] {
  // wiki-weapons.json is the single source of truth (merged with weapon-stats-v2 data)
  const weapons = loadJson<Record<string, unknown>[]>('wiki-weapons.json')

  return weapons.map(w => {
    const name = w.name as string
    const weaponType = (w.type as string) || 'Unknown'
    const weightClass = (w.weightClass as string) || 'Unknown'
    const isPremium = (w.isPremium as boolean) || false

    // Parse damage from penetration field
    let damage = 0
    let damageDisplay = ''
    let shots = 1
    const pen = w.penetration
    if (pen !== undefined && pen !== null) {
      if (typeof pen === 'string' && pen.includes('x')) {
        const parts = pen.split('x').map((s: string) => s.trim())
        damage = parseFloat(parts[0])
        shots = parseInt(parts[1])
        damageDisplay = `${damage} × ${shots}`
      } else {
        damage = typeof pen === 'number' ? pen : parseFloat(pen as string)
        damageDisplay = String(damage)
      }
    } else if (w.damage !== undefined) {
      damage = w.damage as number
      const unit = w.damageUnit as string
      damageDisplay = unit ? `${damage}/sec` : String(damage)
    }

    const reload = (w.loading as number) ?? (w.cooldown as number) ?? 0
    const rangeMax = (w.range as number) ?? 0
    const rangeMin = w.rangeMin as number | undefined
    const angle = (w.maxAngle as number) ?? (w.angle as number) ?? 0
    const scatter = (w.accuracySpread as number) ?? (w.scatter as number) ?? 0

    let dps = 0
    if (reload > 0) {
      dps = (damage * shots) / reload
    }

    const projectileSpeed = (w.projectileSpeedFactor as number) ?? 1.0
    const splashRadius = w.splashRadius as number | undefined
    const overheat = (w.untilOverheat as number) ?? undefined
    const preparation = (w.mortarPreparation as number) ?? undefined
    const structureDamage = (w.specialAbility as string)?.includes('x2') ? 'x2' : undefined

    let placementRestriction = w.placementRestriction as string | undefined
    if (placementRestriction === 'Only for the bow or stern') placementRestriction = 'Bow or Stern only'
    if (placementRestriction === 'For special ships') placementRestriction = 'Special weapon slot'

    // Acquisition & crafting recipe
    const craftingType = w.craftingType as string
    let acquisition = 'Unknown'
    let craftingRecipe: Record<string, number> | undefined
    if (isPremium || craftingType === 'NotAvailable') {
      acquisition = 'Premium'
    } else if (craftingType === 'ByCraft') {
      acquisition = 'Craftable'
      craftingRecipe = computeWeaponCraftRecipe(w.price as number || 0, getWeaponCraftCategory(w))
    } else if (craftingType === 'ByGold') {
      acquisition = 'Gold Purchase'
    }

    return {
      name,
      gameId: (w.gameId as string) || '',
      type: weaponType,
      weightClass,
      damage,
      damageDisplay,
      reload,
      range: rangeMax,
      rangeMin,
      angle,
      scatter,
      dps,
      projectileSpeed,
      splashRadius,
      overheat,
      preparation,
      structureDamage,
      placementRestriction,
      shots,
      acquisition,
      price: (w.price as number) || 0,
      isPremium,
      craftingRecipe,
      description: (w.description as string) || (w.notes as string) || '',
      icon: (w.icon as string) || '',
    }
  })
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
