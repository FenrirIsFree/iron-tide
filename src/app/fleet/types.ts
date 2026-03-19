export type Ship = {
  id: string; name: string; rate: number; shipClass: string; role: string | null
  faction: string | null; hp: number | null; speed: number | null
  maneuverability: number | null; broadsideArmor: number | null
  cargoHold: number | null; crewCapacity: number | null
  displacement: string | null; integrity: number | null
  weaponClass: string | null
  sternSlots: number; broadsideSlots: number; bowSlots: number
  swivelGuns: number; mortarSlots: number; mortarMaxCaliber: number | null
  specialWeaponSlots: number
}

export type Weapon = {
  id: string; name: string; weightClass: string; type: string
  penetration: number | null; penetrationMulti: string | null
  loading: number | null; range: number | null; rangeMin: number | null
  maxAngle: number | null; accuracySpread: number | null
  damage: number | null; splashRadius: number | null; reduction: number | null
  preparation: number | null; firingTime: number | null; damageUnit: string | null
  caliber: number | null; placementRestriction: string | null
  isPremium: boolean; description: string | null
}

export type UpgradeEffect = { stat: string; value: string; gameKey?: string; rankedValues?: string[] }
export type Upgrade = { id: string; name: string; slot: string | null; effect: string | null; effects: UpgradeEffect[] | null }
export type Ammo = { id: string; name: string; effect: string | null }
export type ConsumableItem = { id: string; name: string; category: string | null; description: string | null; effect: string | null }
export type Crew = { id: string; name: string; description: string | null; faction: string | null }

export type LoadoutWeapon = { id: string; weapon: Weapon; position: string; quantity: number }
export type LoadoutUpgrade = { id: string; upgrade: Upgrade }
export type LoadoutAmmo = { id: string; ammoType: Ammo; quantity: number }
export type LoadoutConsumable = { id: string; consumable: ConsumableItem; quantity: number }
export type LoadoutCrew = { id: string; crewType: Crew; quantity: number }

export type Loadout = {
  id: string; name: string; isActive: boolean
  weapons: LoadoutWeapon[]; upgrades: LoadoutUpgrade[]
  ammo: LoadoutAmmo[]; crew: LoadoutCrew[]
  consumables: LoadoutConsumable[]
}

export type UserShip = {
  id: string; shipId: string; nickname: string | null; isPublic: boolean; createdAt: string
  ship: Ship; loadouts: Loadout[]
}

export interface FleetProps {
  initialFleet: UserShip[]
  shipCatalog: Ship[]
  weaponCatalog: Weapon[]
  upgradeCatalog: Upgrade[]
  ammoCatalog: Ammo[]
  crewCatalog: Crew[]
  consumableCatalog: ConsumableItem[]
}

export type SortKey = 'name' | 'rate' | 'class' | 'type' | 'date'

export const BASIC_CREW = ['Sailor', 'Musketeer', 'Soldier', 'Mercenary']

export const CREW_STAT_EFFECTS: Record<string, { gameKey: string; value: number; scalingType?: 'perSailor' | 'perBoarder' }> = {
  'Sail Handler': { gameKey: 'pspeed', value: 4 },
  'Helmsman': { gameKey: 'mmobility', value: 4 },
  'Steersman': { gameKey: 'mmobility', value: 6 },
  'Recruiter': { gameKey: 'mextraplaces', value: 10 },
  'First Mate': { gameKey: 'pspeedchange', value: 0.2, scalingType: 'perSailor' },
}

export const CLASS_DISPLAY: Record<string, string> = {
  'Fast-moving': 'Fast',
  'Battle': 'Combat',
  'Transport': 'Transport',
  'Heavy': 'Heavy',
  'Siege': 'Siege',
  'Imperial': 'Imperial',
}

export type ModifiedStats = {
  hp: number | null; speed: number | null; maneuverability: number | null
  broadsideArmor: number | null; cargoHold: number | null
  crewCapacity: number | null; integrity: number | null
  loading: number | null; range: number | null; penetration: number | null
  accuracy: number | null; reload: number | null
  sternSlots: number; broadsideSlots: number; bowSlots: number
  mortarSlots: number; specialWeaponSlots: number; swivelGuns: number
}

export type CruiseSpeedInfo = { cruiseSpeed: number | null; hasSpeedCrew: boolean; speedCrewBonus: number }
