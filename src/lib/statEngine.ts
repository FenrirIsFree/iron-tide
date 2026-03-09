// Shared stat modifier engine — used by fleet tracker and roster

export type UpgradeEffect = {
  stat: string
  value: string
  gameKey?: string
  rankedValues?: string[]
}

export type UpgradeWithEffects = {
  effects?: UpgradeEffect[] | null
  effect?: string | null
  category?: string | null
  rate?: number
}

export type ShipStats = {
  hp: number | null
  speed: number | null
  maneuverability: number | null
  broadsideArmor: number | null
  cargoHold: number | null
  crewCapacity: number | null
  integrity: number | null
  broadsideSlots: number
  mortarSlots: number
  rate: number
}

export type ModifiedStats = {
  hp: number | null
  speed: number | null
  maneuverability: number | null
  broadsideArmor: number | null
  cargoHold: number | null
  crewCapacity: number | null
  integrity: number | null
  broadsideSlots: number
  mortarSlots: number
}

export type EquippedUpgrade = { upgrade: UpgradeWithEffects }
export type EquippedCrew = { crewType: { name: string }; quantity: number }

export const CREW_STAT_EFFECTS: Record<string, { gameKey: string; value: number; scalingType?: 'perSailor' | 'perBoarder' }> = {
  'Sail Handler': { gameKey: 'pspeed', value: 4 },
  'Helmsman': { gameKey: 'mmobility', value: 4 },
  'Steersman': { gameKey: 'mmobility', value: 6 },
  'Recruiter': { gameKey: 'mextraplaces', value: 10 },
  'First Mate': { gameKey: 'pspeedchange', value: 0.2, scalingType: 'perSailor' },
}

export function parseModValue(value: string): { amount: number; isPercent: boolean } {
  const isPercent = value.includes('%')
  const cleaned = value.replace(/[%+]/g, '').trim()
  const amount = parseFloat(cleaned)
  return { amount: isNaN(amount) ? 0 : amount, isPercent }
}

export function applyMod(base: number | null, value: string): number | null {
  if (base == null) return base
  const { amount, isPercent } = parseModValue(value)
  if (isPercent) return Math.round(base * (1 + amount / 100))
  return base + amount
}

export function getRankedValue(e: UpgradeEffect, shipRate: number): string {
  if (!e.rankedValues || e.rankedValues.length !== 7) return e.value
  const idx = Math.min(6, Math.max(0, 7 - shipRate))
  const val = e.rankedValues[idx]
  return val.startsWith('-') ? val : `+${val}`
}

export function computeModifiedStats(ship: ShipStats, equippedUpgrades: EquippedUpgrade[], equippedCrew?: EquippedCrew[]): ModifiedStats {
  const stats: ModifiedStats = {
    hp: ship.hp,
    speed: ship.speed,
    maneuverability: ship.maneuverability,
    broadsideArmor: ship.broadsideArmor,
    cargoHold: ship.cargoHold,
    crewCapacity: ship.crewCapacity,
    integrity: ship.integrity,
    broadsideSlots: ship.broadsideSlots,
    mortarSlots: ship.mortarSlots,
  }

  for (const lu of equippedUpgrades) {
    const effects = lu.upgrade.effects
    if (!effects) continue
    for (const e of effects) {
      const val = e.rankedValues ? getRankedValue(e, ship.rate) : e.value
      const gk = (e.gameKey || '').toLowerCase()
      const s = e.stat.toLowerCase()

      if (gk === 'mspeed') {
        const { amount } = parseModValue(val)
        if (stats.speed != null) stats.speed = stats.speed + (amount / 2)
      } else if (gk === 'pspeed' || gk === 'pchangeshipspeedbonus') {
        stats.speed = applyMod(stats.speed, val) as number | null
      } else if (gk === 'mmobilitybonus' || gk === 'pmobilitybonus') {
        stats.maneuverability = applyMod(stats.maneuverability, val) as number | null
      } else if (gk === 'marmor' || gk === 'parmor') {
        stats.broadsideArmor = applyMod(stats.broadsideArmor, val) as number | null
      } else if (gk === 'mcapacity' || gk === 'pcapacity') {
        stats.cargoHold = applyMod(stats.cargoHold, val) as number | null
      } else if (gk === 'mextraplaces') {
        stats.crewCapacity = applyMod(stats.crewCapacity, val) as number | null
      } else if (gk === 'mhealth' || gk === 'phealth') {
        if (val.includes('%')) {
          stats.hp = applyMod(stats.hp, val) as number | null
        } else {
          stats.integrity = applyMod(stats.integrity, val) as number | null
        }
      } else if (gk === 'bextramortars') {
        const { amount } = parseModValue(val)
        stats.mortarSlots += amount
      } else if (gk === 'mpreducecannonsquantity') {
        const { amount } = parseModValue(val)
        stats.broadsideSlots = Math.max(0, stats.broadsideSlots + amount)
      } else if (!gk) {
        if (s.includes('speed') && !s.includes('reload') && !s.includes('aim') && !s.includes('cruise') && !s.includes('switch') && !s.includes('collection') && !s.includes('fish') && !s.includes('turn') && !s.includes('projectile')) {
          stats.speed = applyMod(stats.speed, val) as number | null
        } else if (s === 'maneuverability') {
          stats.maneuverability = applyMod(stats.maneuverability, val) as number | null
        } else if (s === 'armor' || s === 'broadside armor') {
          stats.broadsideArmor = applyMod(stats.broadsideArmor, val) as number | null
        } else if (s === 'hold') {
          stats.cargoHold = applyMod(stats.cargoHold, val) as number | null
        } else if (s === 'crew') {
          stats.crewCapacity = applyMod(stats.crewCapacity, val) as number | null
        } else if (s.includes('durability')) {
          stats.integrity = applyMod(stats.integrity, val) as number | null
        } else if (s === 'mortar slots') {
          const { amount } = parseModValue(val)
          stats.mortarSlots += amount
        } else if (s === 'weapons on each side') {
          const { amount } = parseModValue(val)
          stats.broadsideSlots = Math.max(0, stats.broadsideSlots + amount)
        }
      }
    }
  }

  // Apply special crew stat effects
  if (equippedCrew) {
    const sailorCount = equippedCrew
      .filter(c => c.crewType.name === 'Sailor')
      .reduce((sum, c) => sum + c.quantity, 0)

    for (const lc of equippedCrew) {
      const effect = CREW_STAT_EFFECTS[lc.crewType.name]
      if (!effect) continue

      let amount = effect.value
      if (effect.scalingType === 'perSailor') {
        amount = amount * sailorCount
      }

      if (effect.gameKey === 'pspeed') {
        if (stats.speed != null) stats.speed = stats.speed * (1 + amount / 100)
      } else if (effect.gameKey === 'mmobility') {
        if (stats.maneuverability != null) stats.maneuverability = stats.maneuverability + amount
      } else if (effect.gameKey === 'mextraplaces') {
        if (stats.crewCapacity != null) stats.crewCapacity = stats.crewCapacity + amount
      }
    }
  }

  // Round display values
  if (stats.speed != null) stats.speed = Math.round(stats.speed * 10) / 10
  if (stats.maneuverability != null) stats.maneuverability = Math.round(stats.maneuverability)
  if (stats.hp != null) stats.hp = Math.round(stats.hp)
  if (stats.cargoHold != null) stats.cargoHold = Math.round(stats.cargoHold)
  if (stats.crewCapacity != null) stats.crewCapacity = Math.round(stats.crewCapacity)

  return stats
}

// ============================================================
// DPS CALCULATION
// ============================================================

export type LoadoutWeaponForDPS = {
  weapon: {
    penetration: number | null
    loading: number | null
    damage: number | null
    penetrationMulti: string | null
  }
  position: string
  quantity: number
}

export function computeShipDPS(loadoutWeapons: LoadoutWeaponForDPS[]): number {
  let totalDPS = 0
  for (const lw of loadoutWeapons) {
    const { weapon, quantity, position } = lw
    if (!weapon.loading || weapon.loading <= 0) continue

    // Determine raw damage per shot
    let dmgPerShot = 0
    if (weapon.penetration != null) {
      dmgPerShot = weapon.penetration
      // Handle multi-shot (e.g. "x2", "x3")
      if (weapon.penetrationMulti) {
        const match = weapon.penetrationMulti.match(/x(\d+)/)
        if (match) dmgPerShot *= parseInt(match[1])
      }
    } else if (weapon.damage != null) {
      dmgPerShot = weapon.damage
    } else {
      continue
    }

    const weaponDPS = (dmgPerShot / weapon.loading) * quantity
    totalDPS += weaponDPS
  }
  return Math.round(totalDPS * 10) / 10
}
