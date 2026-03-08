'use client'

import { useState, useMemo, type ReactNode } from 'react'

// ── Types ──

interface NpcType {
  typeId: string
  enumValue: number
  displayName: string
  category: string
  description: string
  behavior?: Record<string, boolean>
  icon?: string
  flag?: string
  namePool?: string
  shipClasses?: string[]
  spawnCount?: string
  spawnCondition?: string
  fleetSize?: string
  fixedName?: string
  lifetime?: string | number
  visual?: string
  spawnIntervalMin?: number
  hasDefenseWaves?: boolean
  defenseWaveCount?: string
  hpFormula?: string
  statModifiers?: Record<string, unknown>
  notes?: string
  powerupItemChance?: number
  moreRandomUpgrades?: boolean
  reinforceCannonAngle?: number
  freeFloatingSpeed?: number
  respawnIntervalMin?: number
  portShipSelection?: string
  hp?: string
  usesShipId?: number
  usesShipName?: string
  specialBalls?: number | string
  marchingSpeedBonus?: number
  statScaling?: string
  spawnTrigger?: string
  spawnPerPort?: string
  dropInfo?: {
    summary: string
    items: { icon: string; label: string; value: string }[]
    exampleKillValues?: Record<string, string>
  }
}

interface DefenseWave {
  name: string
  hp: number
  armor: number
  speed: number
  damagePerShot: number
  reloadMs: number
  visual: string
  shipId: number
  shipName: string
  count: number
}

interface BossDrops {
  legendTokens: string
  escudo: number
  rareTradeGoods: string
  chest: string
  woodOrSupplies: string
  gold: string
  ammo?: Record<string, number>
  copper?: string
  voodooSkulls?: number
  lootChests?: string
}

interface Boss {
  name: string
  type: string
  tier: string
  shipId: number
  shipName: string
  hp: number
  armor: number
  speed: number
  damagePerShot: number
  reloadSec: number
  cannonClass?: string
  cannonDistOverride?: number
  specialBalls?: number | null
  specialBallsNote?: string
  visual?: string
  specialServerEffect?: number
  overrideCrewCount?: number
  spawnRegions: number[]
  fleetsPerRegion: number
  fleetSize: number
  defenseWaves: DefenseWave[]
  notes?: string
  killValue?: number
  xpReward?: number
  computedDps?: number
  drops?: BossDrops
}

interface ProceduralNpc {
  count?: number
  name: string
  type: string
  visual?: string
  spawnIntervalMin?: number
  shipClasses?: string[]
  statModifiers?: Record<string, unknown>
  specialBalls?: string
  notes?: string
  usesShip?: string
}

interface EducationNpc {
  name: string
  type: string
  shipId: number
  shipName: string
  hp: number
  armor: number
  speed: number
  damagePerShot: number
  reloadMs: number
  scenario: string
}

interface NpcData {
  npcTypes: NpcType[]
  bosses: Boss[]
  proceduralNpcs: Record<string, ProceduralNpc>
  educationMapNpcs: EducationNpc[]
  npcShipNames: Record<string, string[]>
  captureSystem: Record<string, string>
  rewardSystem: Record<string, unknown>
  spawnMechanics: Record<string, unknown>
  npcCrewCount: Record<string, string>
  wantedLevel: Record<string, unknown>
  specialBallTypes: Record<string, string>
}

// ── Humanize helpers ──

const WATER_HAZARD: Record<number, string> = {
  1: 'Water Hazard 1 (Starter)',
  2: 'Water Hazard 2',
  3: 'Water Hazard 3',
  4: 'Water Hazard 4',
  5: 'Water Hazard 5',
  6: 'Water Hazard 6',
  7: 'Water Hazard 7 (Endgame)',
}

const WH_SHORT: Record<number, string> = {
  1: 'WH 1',
  2: 'WH 2',
  3: 'WH 3',
  4: 'WH 4',
  5: 'WH 5',
  6: 'WH 6',
  7: 'WH 7',
}

const VISUAL_NAMES: Record<string, string> = {
  Regular: 'Standard',
  BloodShip: 'Blood Ship (crimson sails)',
  ShadowShip: 'Shadow Ship (dark hull)',
  GhostShip: 'Ghost Ship (spectral)',
  IceShip: 'Ice Ship (frozen)',
  DirtShip: 'Sand Ship (weathered)',
  MagmaShip: 'Magma Ship (volcanic)',
  DestroyedShip: 'Destroyed Ship (wreckage)',
}

const CANNON_NAMES: Record<string, string> = {
  DistanceCannon: 'Long Cannon',
  HeavyCannon: 'Heavy Cannon',
  LiteCannon: 'Light Cannon',
  Bombardier: 'Bombard',
  Mortar: 'Mortar',
}

const AMMO_NAMES: Record<number, string> = {
  1: 'Round Shot',
  2: 'Fire Ball',
  3: 'Chain Shot',
  5: 'Ice Ball',
  7: 'Grape Shot',
  9: 'Explosive',
  10: 'Special Ammo',
  21: 'Event Ammo',
  500: 'Boss Ammo',
}

const TIER_COLORS: Record<string, string> = {
  '2-star': 'text-blue-400',
  '3-star': 'text-purple-400',
}

const TIER_LABELS: Record<string, string> = {
  '2-star': '⭐⭐ 2-Star',
  '3-star': '⭐⭐⭐ 3-Star',
}

const CATEGORY_COLORS: Record<string, string> = {
  pirate: 'text-red-400',
  empire: 'text-blue-400',
  trader: 'text-green-400',
  other: 'text-foreground-secondary',
}

const CATEGORY_ICONS: Record<string, string> = {
  pirate: '🏴‍☠️',
  empire: '👑',
  trader: '🪙',
  other: '⚓',
}

const SHIP_CLASS_NAMES: Record<string, string> = {
  Destroyer: 'Destroyer',
  Hardship: 'Warship',
  Battleship: 'Battleship',
  CargoShip: 'Cargo Ship',
  Mortar: 'Mortar Ship',
}

const SERVER_EFFECTS: Record<number, string> = {
  1: 'Special visual effect',
  2: 'Explosive aura',
}

const FLAG_NAMES: Record<string, string> = {
  Pirate: '🏴‍☠️ Pirate flag',
  Trader: '🪙 Merchant flag',
  War: '⚔️ War flag',
  NoFlag: 'No flag',
}

// WH stat scaling data (from decompiled npcStats)
const WH_SCALING = [
  { wh: 1, hp: '~60%', damage: '~42%', speed: 'Slower', range: 'Shorter', color: 'text-green-400' },
  { wh: 2, hp: '~67%', damage: '~50%', speed: 'Slower', range: 'Shorter', color: 'text-green-300' },
  { wh: 3, hp: '~74%', damage: '~58%', speed: 'Moderate', range: 'Moderate', color: 'text-yellow-400' },
  { wh: 4, hp: '~83%', damage: '~67%', speed: 'Moderate', range: 'Moderate', color: 'text-yellow-300' },
  { wh: 5, hp: '~90%', damage: '~75%', speed: 'Near full', range: 'Near full', color: 'text-orange-400' },
  { wh: 6, hp: '~96%', damage: '~92%', speed: 'Near full', range: 'Near full', color: 'text-orange-300' },
  { wh: 7, hp: '100%', damage: '100%', speed: 'Full', range: 'Full', color: 'text-red-400' },
]

// What spawns where
const WH_SPAWN_INFO: { wh: string; npcs: string; color: string }[] = [
  { wh: 'WH 1–2', npcs: 'Small Vessels, Regular Pirates, Khanfar Merchants, Imperial Raiders, Bounty Hunters', color: 'text-green-400' },
  { wh: 'WH 3', npcs: '+ Order of the New Ark appears, Mortar ships, Sea Elves (event)', color: 'text-yellow-400' },
  { wh: 'WH 4+', npcs: '+ Pirate Barons, Order Warships, stronger fleets, Order of the New Ark regulars', color: 'text-orange-400' },
  { wh: 'WH 5–7', npcs: '+ Strongest ships, Witnesses of the Apocalypse near strongholds, highest-rank ships', color: 'text-red-400' },
  { wh: 'Legend Zone', npcs: '3-Star Bosses only — center of map, requires rank 12+', color: 'text-purple-400' },
]

// ── Sub-components ──

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-surface-hover rounded p-2">
      <span className="text-foreground-muted block text-xs">{label}</span>
      <span className={`${color ?? 'text-foreground'} font-medium`}>{value}</span>
    </div>
  )
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded inline-block">
      <span className="text-foreground-muted">{label}:</span> {value}
    </span>
  )
}

function Badge({ color, text }: { color: string; text: string }) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-400/10 text-red-400',
    green: 'bg-green-400/10 text-green-400',
    blue: 'bg-blue-400/10 text-blue-400',
    orange: 'bg-orange-400/10 text-orange-400',
    yellow: 'bg-yellow-400/10 text-yellow-400',
    purple: 'bg-purple-400/10 text-purple-400',
    cyan: 'bg-cyan-400/10 text-cyan-400',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded ${colorMap[color] ?? 'bg-surface-hover text-foreground-secondary'}`}>
      {text}
    </span>
  )
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-surface-hover rounded-lg p-3 mt-3">
      <h4 className="text-foreground font-medium text-sm mb-2">{title}</h4>
      {children}
    </div>
  )
}

function renderBehavior(behavior?: Record<string, boolean>) {
  if (!behavior) return null
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {behavior.aggressive ? (
        <Badge color="red" text="⚔️ Aggressive — attacks on sight" />
      ) : null}
      {behavior.attacksPlayers && !behavior.aggressive ? (
        <Badge color="orange" text="🎯 Attacks players" />
      ) : null}
      {behavior.attacksPeacePlayers ? (
        <Badge color="red" text="💀 Attacks peaceful players" />
      ) : null}
      {behavior.attacksTraderNpcs ? (
        <Badge color="orange" text="📦 Attacks traders" />
      ) : null}
      {!behavior.aggressive && !behavior.attacksPlayers ? (
        <Badge color="green" text="🕊️ Peaceful — will not attack" />
      ) : null}
      {behavior.canBeCaptured ? (
        <Badge color="green" text="🏴 Can be captured" />
      ) : (
        <Badge color="red" text="🚫 Cannot be captured" />
      )}
      {behavior.showOnWorldMap ? (
        <Badge color="blue" text="🗺️ Visible on world map" />
      ) : null}
      {behavior.weakBehavior ? (
        <Badge color="yellow" text="💨 Flees from combat" />
      ) : null}
      {behavior.canRestoreBurning ? (
        <Badge color="cyan" text="🔥 Can extinguish fires" />
      ) : null}
      {behavior.alwaysReduceCollisionDamage ? (
        <Badge color="cyan" text="🛡️ Reduced collision damage" />
      ) : null}
      {behavior.improvedProsecutionDistance ? (
        <Badge color="purple" text="🎯 Extended pursuit range" />
      ) : null}
      {behavior.alwaysAttackPlayersWithWantedLevel ? (
        <Badge color="red" text="🎯 Targets wanted players" />
      ) : null}
      {behavior.createLootByDroppingChests ? (
        <Badge color="yellow" text="💎 Drops loot chests" />
      ) : null}
      {behavior.hideMaxCrewCount ? (
        <Badge color="purple" text="❓ Hidden crew count" />
      ) : null}
    </div>
  )
}

// Loot mapping shared between bosses and NPC encounters
const LOOT_MAPPING: Record<string, { category: string; subKey?: string }> = {
  Seafarer: { category: 'seafarer' },
  PirateFraction1_Regular: { category: 'pirates', subKey: 'regular' },
  PirateFraction1_Reinforced: { category: 'pirates', subKey: 'reinforced' },
  PirateFraction1_Fleet: { category: 'pirates', subKey: 'reinforced' },
  PirateFraction2_Regular: { category: 'order', subKey: 'regular' },
  PirateFraction2_Reinforced: { category: 'order', subKey: 'reinforced' },
  PirateFraction2_Fleet: { category: 'order', subKey: 'convoy' },
  Trader_Regular: { category: 'traders', subKey: 'regular' },
  Trader_Ferryman: { category: 'traders', subKey: 'ferryman' },
  Empire_Regular: { category: 'empire', subKey: 'regular' },
  Empire_Invasion: { category: 'empire', subKey: 'invasion' },
  Empire_Legendary2l: { category: 'empire', subKey: 'legendary2l' },
  Empire_Legendary3l: { category: 'empire', subKey: 'legendary3l' },
  PortPatrol: { category: 'portPatrol' },
  Fanatics: { category: 'order', subKey: 'regular' },
  HeadHunter: { category: 'bountyHunter' },
  NyEventNpc: { category: 'nyEventNpc' },
}

function LootDrops({ typeId, lootByType }: { typeId: string; lootByType: Record<string, unknown> }) {
  const mapping = LOOT_MAPPING[typeId]
  if (!mapping) return null
  const lootCatData = lootByType[mapping.category] as Record<string, unknown> | undefined
  if (!lootCatData) return null

  const subData = mapping.subKey ? lootCatData[mapping.subKey] as Record<string, unknown> | undefined : null
  const drops = (subData?.drops ?? lootCatData.drops ?? null) as string[] | null
  const summary = (subData ? null : lootCatData.summary) as string | null
  const subLabel = subData?.label as string | null

  if (!drops && !summary) return null
  return (
    <InfoSection title="💰 Loot Drops">
      {subLabel ? <p className="text-accent text-xs font-medium mb-1">{subLabel}</p> : null}
      {summary ? <p className="text-foreground-secondary text-sm mb-2">{summary}</p> : null}
      {drops ? (
        <ul className="space-y-1">
          {drops.map((drop, i) => (
            <li key={i} className="text-foreground-secondary text-sm">{drop}</li>
          ))}
        </ul>
      ) : null}
    </InfoSection>
  )
}

// WH spawn range data for NPC types
const NPC_WH_RANGES: Record<string, string> = {
  Seafarer: 'WH 1–7',
  PirateFraction1_Regular: 'WH 1–7 (doubled in WH 1–3)',
  PirateFraction1_Reinforced: 'WH 1–7',
  PirateFraction1_Fleet: 'WH 1–7',
  PirateFraction2_Regular: 'WH 4+',
  PirateFraction2_Reinforced: 'WH 4+',
  PirateFraction2_Fleet: 'WH 4+',
  Trader_Regular: 'WH 1–7',
  Trader_Ferryman: 'WH 1–7',
  PortPatrol: 'All ports',
  Empire_Regular: 'WH 1–7',
  Empire_Invasion: 'All ports',
  Empire_Legendary2l: 'Varies by boss',
  Empire_Legendary3l: 'Legend Boss Zone',
  Fanatics: 'WH 1–7 (near strongholds)',
  HeadHunter: 'WH 1–7 (wanted level)',
  NyEventNpc: 'WH 3+ (event only)',
  BonusMap: 'Bonus maps only',
  BonusMapBoss: 'Bonus maps only',
  SpecialNoReward: 'Special / Tutorial',
}

// ── Main Component ──

export default function NpcContent({ npcs }: { npcs: NpcData }) {
  const [tab, setTab] = useState<'bosses' | 'encounters' | 'guide'>('bosses')
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const [tierFilter, setTierFilter] = useState<string>('all')

  const bosses2Star = useMemo(() => npcs.bosses.filter(b => b.tier === '2-star').sort((a, b) => a.hp - b.hp), [npcs.bosses])
  const bosses3Star = useMemo(() => npcs.bosses.filter(b => b.tier === '3-star').sort((a, b) => a.hp - b.hp), [npcs.bosses])

  const filteredBosses = useMemo(() => {
    if (tierFilter === '2-star') return bosses2Star
    if (tierFilter === '3-star') return bosses3Star
    return [...bosses2Star, ...bosses3Star]
  }, [tierFilter, bosses2Star, bosses3Star])

  const activeNpcTypes = useMemo(() =>
    npcs.npcTypes.filter(n => !n.typeId.startsWith('Rem_') && n.typeId !== 'SpecialNoReward' && n.typeId !== 'BonusMap' && n.typeId !== 'BonusMapBoss'),
    [npcs.npcTypes]
  )

  const npcsByCategory = useMemo(() => {
    const groups: Record<string, NpcType[]> = {}
    for (const n of activeNpcTypes) {
      const cat = n.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(n)
    }
    return groups
  }, [activeNpcTypes])

  const lootByType = (npcs.rewardSystem?.lootByType ?? {}) as Record<string, unknown>

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'bosses' as const, label: `🏴‍☠️ Bosses (${npcs.bosses.length})` },
          { id: 'encounters' as const, label: `⚓ NPC Encounters (${activeNpcTypes.length})` },
          { id: 'guide' as const, label: '🗺️ Water Hazard Guide' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════ BOSSES TAB ═══════════════════ */}
      {tab === 'bosses' ? (
        <div>
          <div className="flex gap-2 mb-4">
            {['all', '2-star', '3-star'].map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tierFilter === tier ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
                }`}
              >
                {tier === 'all' ? `All Bosses (${npcs.bosses.length})` : TIER_LABELS[tier]}
              </button>
            ))}
          </div>

          {/* Boss tier explanation */}
          <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 text-sm text-foreground-secondary grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-blue-400 font-medium mb-1">⭐⭐ 2-Star Bosses ({bosses2Star.length})</h4>
              <p>Imperial Flagships that spawn across <strong>multiple Water Hazard levels</strong> (WH 2–7). Moderate difficulty — good for farming Escudo. 5-minute respawn timer. Can extinguish fires and resist collision damage.</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-medium mb-1">⭐⭐⭐ 3-Star Bosses ({bosses3Star.length})</h4>
              <p>Imperial Legends — the most powerful NPCs in the game. Only spawn in the <strong>Legend Boss Zone</strong> (center of the map). <strong>12-hour respawn</strong>. Drop loot chests with large Escudo, Copper, and Voodoo Skulls. Hidden crew counts. Requires player rank 12+ to enter the hazard zone.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredBosses.map(boss => {
              const dps = boss.reloadSec > 0 ? boss.damagePerShot / boss.reloadSec : 0
              const isExpanded = expandedBoss === boss.name
              const totalDamage = boss.damagePerShot + (boss.defenseWaves.reduce((sum, w) => sum + w.damagePerShot * w.count, 0))

              return (
                <div
                  key={boss.name}
                  className="bg-surface border border-surface-border rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedBoss(isExpanded ? null : boss.name)}
                    className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-foreground font-semibold text-lg">{boss.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${TIER_COLORS[boss.tier] ?? 'text-foreground-secondary'} bg-surface-hover`}>
                        {TIER_LABELS[boss.tier] ?? boss.tier}
                      </span>
                      {boss.defenseWaves.length > 0 ? (
                        <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                          +{boss.defenseWaves.reduce((s, w) => s + w.count, 0)} Escorts
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
                      <span className="text-red-400 font-medium">❤️ {boss.hp.toLocaleString()}</span>
                      <span className="text-foreground-secondary">🚢 {boss.shipName}</span>
                      <span className="text-accent font-medium">⚔️ {dps.toFixed(1)} DPS</span>
                      <span className="text-foreground-muted">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="px-4 pb-4 border-t border-surface-border pt-3">
                      {/* Combat Stats */}
                      <h4 className="text-foreground-muted text-xs font-medium mb-2 uppercase tracking-wider">Combat Stats</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm mb-4">
                        <StatCard label="Hit Points" value={boss.hp.toLocaleString()} color="text-red-400" />
                        <StatCard label="Armor" value={String(boss.armor)} />
                        <StatCard label="Speed" value={`${boss.speed} kn`} />
                        <StatCard label="Damage / Shot" value={boss.damagePerShot.toLocaleString()} />
                        <StatCard label="Reload Time" value={`${boss.reloadSec}s`} />
                        <StatCard label="DPS" value={dps.toFixed(1)} color="text-accent" />
                      </div>

                      {/* Weapon & Ship Info */}
                      <h4 className="text-foreground-muted text-xs font-medium mb-2 uppercase tracking-wider">Weapon & Ship</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm mb-4">
                        <StatCard label="Weapon Type" value={boss.cannonClass ? CANNON_NAMES[boss.cannonClass] ?? boss.cannonClass : 'Custom (overridden)'} />
                        <StatCard label="Cannon Range" value={boss.cannonDistOverride ? String(boss.cannonDistOverride) : 'Ship default'} />
                        <StatCard label="Special Ammo" value={
                          boss.specialBalls != null
                            ? AMMO_NAMES[boss.specialBalls] ?? `Type ${boss.specialBalls}`
                            : 'None'
                        } />
                        <StatCard label="Hull" value={boss.shipName} />
                        {boss.overrideCrewCount ? (
                          <StatCard label="Crew" value={boss.overrideCrewCount.toLocaleString()} />
                        ) : null}
                        <StatCard label="Appearance" value={boss.visual ? VISUAL_NAMES[boss.visual] ?? boss.visual : 'Standard'} />
                      </div>

                      {/* Spawn Info */}
                      <h4 className="text-foreground-muted text-xs font-medium mb-2 uppercase tracking-wider">Location & Spawning</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Tag label="Spawn Location" value={
                          boss.tier === '3-star'
                            ? 'Legend Boss Zone (center of map)'
                            : boss.spawnRegions.map(r => WH_SHORT[r] ?? `WH ${r}`).join(', ')
                        } />
                        <Tag label="Fleet Composition" value={
                          boss.fleetSize === 1
                            ? `Solo boss — ${boss.fleetsPerRegion} spawn${boss.fleetsPerRegion > 1 ? 's' : ''} per region`
                            : `${boss.fleetSize} ships per fleet — ${boss.fleetsPerRegion} fleets per region`
                        } />
                        {boss.specialServerEffect ? (
                          <Tag label="Special Effect" value={SERVER_EFFECTS[boss.specialServerEffect] ?? 'Visual effect'} />
                        ) : null}
                        {boss.tier === '3-star' ? (
                          <Tag label="Respawn" value="12 hours" />
                        ) : (
                          <Tag label="Respawn" value="5 minutes" />
                        )}
                      </div>

                      {/* Escort Ships */}
                      {boss.defenseWaves.length > 0 ? (
                        <InfoSection title={`🛡️ Escort Ships (${boss.defenseWaves.reduce((s, w) => s + w.count, 0)} total)`}>
                          <div className="grid gap-2">
                            {boss.defenseWaves.map((wave, i) => {
                              const waveDps = wave.damagePerShot / (wave.reloadMs / 1000)
                              return (
                                <div key={i} className="bg-surface rounded-lg p-2">
                                  <div className="flex flex-wrap gap-4 text-sm text-foreground-secondary">
                                    <span className="text-foreground font-medium">{wave.count}× {wave.shipName}</span>
                                    <span>❤️ {wave.hp.toLocaleString()} HP</span>
                                    <span>🛡️ {wave.armor} Armor</span>
                                    <span>⚡ {wave.speed} kn</span>
                                    <span>⚔️ {wave.damagePerShot} dmg / {(wave.reloadMs / 1000).toFixed(0)}s</span>
                                    <span className="text-accent">({waveDps.toFixed(1)} DPS each)</span>
                                  </div>
                                  {wave.visual !== 'Regular' ? (
                                    <span className="text-foreground-muted text-xs mt-1 block">
                                      Appearance: {VISUAL_NAMES[wave.visual] ?? wave.visual}
                                    </span>
                                  ) : null}
                                </div>
                              )
                            })}
                          </div>
                          <p className="text-foreground-muted text-xs mt-2">
                            Total encounter damage: {totalDamage.toLocaleString()} per volley (boss + all escorts)
                          </p>
                        </InfoSection>
                      ) : null}

                      {/* Loot Drops */}
                      {boss.drops ? (
                        <InfoSection title={`💰 Loot Drops (Kill Value: ${boss.killValue?.toLocaleString() ?? '?'} gold · ${boss.xpReward?.toLocaleString() ?? '?'} XP)`}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-2">
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">👑 Legend Tokens</span>
                              <span className="text-yellow-400 font-medium">{boss.drops.legendTokens}</span>
                            </div>
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">⭐ Escudo</span>
                              <span className="text-foreground font-medium">{boss.drops.escudo}</span>
                            </div>
                            {boss.drops.copper ? (
                              <div className="bg-surface rounded p-2">
                                <span className="text-foreground-muted text-xs block">🟤 Copper</span>
                                <span className="text-foreground font-medium">{boss.drops.copper}</span>
                              </div>
                            ) : null}
                            {boss.drops.voodooSkulls ? (
                              <div className="bg-surface rounded p-2">
                                <span className="text-foreground-muted text-xs block">💀 Voodoo Skulls</span>
                                <span className="text-foreground font-medium">{boss.drops.voodooSkulls}</span>
                              </div>
                            ) : null}
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">📦 Rare Trade Goods</span>
                              <span className="text-foreground-secondary text-xs">{boss.drops.rareTradeGoods}</span>
                            </div>
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">📦 Chest</span>
                              <span className="text-foreground-secondary text-xs">{boss.drops.chest}</span>
                            </div>
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">📦 Wood / Supplies</span>
                              <span className="text-foreground-secondary text-xs">{boss.drops.woodOrSupplies}</span>
                            </div>
                            <div className="bg-surface rounded p-2">
                              <span className="text-foreground-muted text-xs block">💰 Gold</span>
                              <span className="text-foreground-secondary text-xs">{boss.drops.gold}</span>
                            </div>
                          </div>
                          {boss.drops.ammo ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-foreground-muted">💣 Ammo:</span>
                              {Object.entries(boss.drops.ammo).map(([wh, count]) => (
                                <span key={wh} className="bg-surface text-foreground-secondary px-2 py-0.5 rounded">
                                  WH {wh}: {count}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-foreground-muted text-xs">💣 Ammo: Legend Boss Zone rates</p>
                          )}
                          {boss.drops.lootChests ? (
                            <p className="text-green-400 text-xs mt-1">💎 {boss.drops.lootChests}</p>
                          ) : null}
                        </InfoSection>
                      ) : (
                        <LootDrops typeId={boss.type} lootByType={lootByType} />
                      )}

                      {/* Notes */}
                      {boss.notes ? (
                        <p className="text-foreground-muted text-xs mt-3 italic">📝 {boss.notes}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* ═══════════════════ NPC ENCOUNTERS TAB ═══════════════════ */}
      {tab === 'encounters' ? (
        <div>
          {/* Stat scaling note */}
          <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 text-sm">
            <p className="text-foreground-secondary">
              📊 <strong className="text-foreground">Stats scale with Water Hazard level</strong> — NPCs are weaker in low WH zones and reach full strength in WH 7.
              Northern waters (some WH 3–6 regions) give pirates <span className="text-red-400">+20% HP</span> and <span className="text-orange-400">+10% damage</span>.
              See the <button onClick={() => setTab('guide')} className="text-accent underline hover:text-accent/80">Water Hazard Guide</button> for full scaling details.
            </p>
          </div>

          {/* NPC types grouped by category */}
          {['pirate', 'empire', 'trader', 'other'].map(category => {
            const types = npcsByCategory[category]
            if (!types || types.length === 0) return null
            return (
              <div key={category} className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${CATEGORY_COLORS[category]}`}>
                  {CATEGORY_ICONS[category]} {category === 'pirate' ? 'Pirates' : category === 'empire' ? 'Empire' : category === 'trader' ? 'Traders' : 'Other'}
                  <span className="text-foreground-muted text-sm font-normal ml-2">({types.length})</span>
                </h3>
                <div className="grid gap-3">
                  {types.map(npc => {
                    const isExpanded = expandedType === npc.typeId
                    const whRange = NPC_WH_RANGES[npc.typeId]

                    return (
                      <div
                        key={npc.typeId}
                        className="bg-surface border border-surface-border rounded-xl overflow-hidden"
                      >
                        <div
                          onClick={() => setExpandedType(isExpanded ? null : npc.typeId)}
                          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="text-foreground font-medium">{npc.displayName}</h4>
                            {npc.behavior?.canBeCaptured ? (
                              <span className="text-xs px-2 py-0.5 rounded bg-green-400/10 text-green-400 font-medium">🏴 Capturable</span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-red-400/10 text-red-400">🚫 Not capturable</span>
                            )}
                            {npc.behavior?.aggressive ? (
                              <span className="text-red-400 text-xs">⚔️ Hostile</span>
                            ) : null}
                            {npc.behavior && !npc.behavior.aggressive && !npc.behavior.attacksPlayers ? (
                              <span className="text-green-400 text-xs">🕊️ Peaceful</span>
                            ) : null}
                            {whRange ? (
                              <span className="text-foreground-muted text-xs">📍 {whRange}</span>
                            ) : null}
                          </div>
                          <span className="text-foreground-muted text-sm">{isExpanded ? '▲' : '▼'}</span>
                        </div>

                        {isExpanded ? (
                          <div className="px-4 pb-4 border-t border-surface-border pt-3">
                            <p className="text-foreground-secondary text-sm mb-3">{npc.description}</p>

                            {/* Behavior badges */}
                            {renderBehavior(npc.behavior)}

                            {/* Key hunt info */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {npc.shipClasses ? (
                                <Tag label="Ship Classes" value={npc.shipClasses.map(c => SHIP_CLASS_NAMES[c] ?? c).join(', ')} />
                              ) : null}
                              {npc.spawnCount ? (
                                <Tag label="Spawn Count" value={npc.spawnCount} />
                              ) : null}
                              {npc.spawnCondition ? (
                                <Tag label="Spawn Condition" value={npc.spawnCondition} />
                              ) : null}
                              {npc.fleetSize ? (
                                <Tag label="Fleet Size" value={npc.fleetSize} />
                              ) : null}
                              {npc.hasDefenseWaves ? (
                                <Tag label="Defense Waves" value={npc.defenseWaveCount ?? 'Yes'} />
                              ) : null}
                              {npc.respawnIntervalMin ? (
                                <Tag label="Respawn" value={npc.respawnIntervalMin >= 60 ? `${npc.respawnIntervalMin / 60} hours` : `${npc.respawnIntervalMin} min`} />
                              ) : null}
                              {npc.spawnIntervalMin ? (
                                <Tag label="Spawn Interval" value={`${npc.spawnIntervalMin} min`} />
                              ) : null}
                              {npc.lifetime ? (
                                <Tag label="Lifetime" value={String(npc.lifetime)} />
                              ) : null}
                              {npc.spawnPerPort ? (
                                <Tag label="Per Port" value={npc.spawnPerPort} />
                              ) : null}
                              {npc.flag && npc.flag !== 'NoFlag' ? (
                                <Tag label="Flag" value={FLAG_NAMES[npc.flag] ?? npc.flag} />
                              ) : null}
                              {npc.spawnTrigger ? (
                                <Tag label="Spawn Trigger" value={npc.spawnTrigger} />
                              ) : null}
                            </div>

                            {/* Stat modifiers */}
                            {npc.statModifiers ? (
                              <InfoSection title="📊 Stat Modifiers">
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(npc.statModifiers).map(([key, val]) => {
                                    const label = key
                                      .replace(/Multiplier/i, '')
                                      .replace(/Bonus/i, '')
                                      .replace(/Reduction/i, '')
                                      .replace(/([A-Z])/g, ' $1')
                                      .trim()
                                    const prefix = /multiplier/i.test(key) ? '×' : /bonus/i.test(key) ? '+' : /reduction/i.test(key) ? '−' : ''
                                    return (
                                      <span key={key} className="bg-surface text-foreground-secondary text-xs px-2 py-1 rounded">
                                        {label}: <span className="text-accent">{prefix}{String(val)}</span>
                                      </span>
                                    )
                                  })}
                                </div>
                              </InfoSection>
                            ) : null}

                            {/* HP Formula */}
                            {npc.hpFormula ? (
                              <InfoSection title="❤️ HP Formula">
                                <code className="text-cyan-400 text-xs">{npc.hpFormula}</code>
                              </InfoSection>
                            ) : null}

                            {/* Port ship selection */}
                            {npc.portShipSelection ? (
                              <InfoSection title="🚢 Ship Selection by Water Hazard">
                                <p className="text-foreground-secondary text-sm">{npc.portShipSelection}</p>
                              </InfoSection>
                            ) : null}

                            {/* Loot info */}
                            {npc.dropInfo ? (
                              <InfoSection title={`💰 ${npc.dropInfo.summary}`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-2">
                                  {npc.dropInfo.items.map((item, i) => (
                                    <div key={i} className="bg-surface rounded p-2">
                                      <span className="text-foreground-muted text-xs block">{item.icon} {item.label}</span>
                                      <span className="text-foreground-secondary text-xs">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                                {npc.dropInfo.exampleKillValues ? (
                                  <div className="mt-2">
                                    <span className="text-foreground-muted text-xs font-medium block mb-1">📊 Example drops by Water Hazard:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {Object.entries(npc.dropInfo.exampleKillValues).map(([wh, val]) => (
                                        <span key={wh} className="bg-surface text-xs px-2 py-1 rounded">
                                          <span className="text-accent">{wh}:</span>{' '}
                                          <span className="text-foreground-secondary">{val}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </InfoSection>
                            ) : (
                              <LootDrops typeId={npc.typeId} lootByType={lootByType} />
                            )}

                            {/* Notes */}
                            {npc.notes ? (
                              <p className="text-foreground-muted text-xs mt-3 italic">📝 {npc.notes}</p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {/* ═══════════════════ WATER HAZARD GUIDE TAB ═══════════════════ */}
      {tab === 'guide' ? (
        <div className="grid gap-6">

          {/* Section 1: Stat Scaling */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">📊 NPC Stat Scaling by Water Hazard Level</h3>
            <p className="text-foreground-secondary text-sm mb-4">
              NPC stats are generated from the ship&apos;s base stats, then scaled by the Water Hazard level. Lower WH zones have significantly weaker NPCs.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-foreground-secondary text-left border-b border-surface-border">
                    <th className="pb-2 pr-4">Level</th>
                    <th className="pb-2 pr-4">HP</th>
                    <th className="pb-2 pr-4">Damage</th>
                    <th className="pb-2 pr-4">Speed</th>
                    <th className="pb-2 pr-4">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {WH_SCALING.map(row => (
                    <tr key={row.wh} className="border-b border-surface-border/50">
                      <td className={`py-2 pr-4 font-medium ${row.color}`}>WH {row.wh}</td>
                      <td className="py-2 pr-4 text-foreground-secondary">{row.hp}</td>
                      <td className="py-2 pr-4 text-foreground-secondary">{row.damage}</td>
                      <td className="py-2 pr-4 text-foreground-secondary">{row.speed}</td>
                      <td className="py-2 pr-4 text-foreground-secondary">{row.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-orange-400/10 rounded-lg p-3 mt-4 text-sm">
              <span className="text-orange-400 font-medium">⚠️ Northern Waters Bonus:</span>
              <span className="text-foreground-secondary ml-2">
                Some regions in WH 3, 4, 5, 6 are &quot;northern waters&quot; — pirates there get <strong className="text-red-400">+20% HP</strong> and <strong className="text-orange-400">+10% damage</strong>. Ammo drops are also 100% guaranteed and force Ice Ball (type 5).
              </span>
            </div>
          </div>

          {/* Section 2: What Spawns Where */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🌊 What Spawns Where</h3>
            <div className="grid gap-3 mb-6">
              {WH_SPAWN_INFO.map((row, i) => (
                <div key={i} className="bg-surface-hover rounded-lg p-3">
                  <span className={`font-semibold ${row.color}`}>{row.wh}:</span>
                  <span className="text-foreground-secondary ml-2 text-sm">{row.npcs}</span>
                </div>
              ))}
            </div>

            {/* 2-Star Boss Spawn Locations */}
            <h4 className="text-foreground font-medium mb-3">⭐⭐ 2-Star Boss Spawn Locations</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {bosses2Star.map(boss => (
                <div key={boss.name} className="bg-surface-hover rounded-lg p-3 flex justify-between items-center">
                  <span className="text-foreground font-medium text-sm">{boss.name}</span>
                  <span className="text-blue-400 text-xs font-medium">
                    {boss.spawnRegions.map(r => `WH ${r}`).join(', ')}
                  </span>
                </div>
              ))}
            </div>

            {/* 3-Star Bosses */}
            <h4 className="text-foreground font-medium mb-3">⭐⭐⭐ 3-Star Boss Spawn Location</h4>
            <div className="bg-purple-400/10 rounded-lg p-3 text-sm">
              <span className="text-purple-400 font-medium">Legend Boss Zone (center of map)</span>
              <span className="text-foreground-secondary ml-2">— all {bosses3Star.length} legendary bosses spawn here. 12-hour respawn. Requires rank 12+.</span>
            </div>
          </div>

          {/* Section 3: Capture Rules */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🏴 Capture Rules</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-400/5 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">✅ Can Capture</h4>
                <p className="text-foreground-secondary text-sm">{npcs.captureSystem?.canCapture ?? 'Pirates, Traders, Seafarers, Fanatics'}</p>
              </div>
              <div className="bg-red-400/5 rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">❌ Cannot Capture</h4>
                <p className="text-foreground-secondary text-sm">{npcs.captureSystem?.cannotCapture ?? 'Empire, Port Patrol'}</p>
              </div>
            </div>
            <p className="text-foreground-muted text-xs mt-3">{npcs.captureSystem?.captureRule}</p>
            {npcs.captureSystem?.mechanics ? (
              <p className="text-foreground-secondary text-sm mt-2">⚓ {npcs.captureSystem.mechanics}</p>
            ) : null}
          </div>

          {/* Section 4: Reward Mechanics */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">💰 Reward Mechanics</h3>

            {/* How kill value works */}
            <div className="bg-surface-hover rounded-lg p-3 mb-4">
              <h4 className="text-foreground font-medium text-sm mb-2">📊 Kill Value</h4>
              <p className="text-foreground-secondary text-sm">
                {(npcs.rewardSystem as Record<string, unknown>)?.description as string ?? 'Every NPC has a kill value based on its combat stats.'}
              </p>
              <p className="text-foreground-muted text-xs mt-2">
                Calculated from <strong>HP</strong>, <strong>speed</strong>, <strong>armor</strong>, and <strong>DPS</strong>. Traders start with a higher base (150 gold vs 75). Location multipliers apply.
              </p>
            </div>

            {/* Sinking vs Boarding */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-red-400 font-medium text-sm mb-2">💥 Sinking</h4>
                <p className="text-foreground-secondary text-sm">Drops gold, resources, ammo, and chance for powerup items. Full kill value rewarded.</p>
              </div>
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-green-400 font-medium text-sm mb-2">🏴 Boarding & Capture</h4>
                <p className="text-foreground-secondary text-sm">Capture the ship (if capturable), recruit crew, and dismantle for resources. Different loot table.</p>
              </div>
            </div>

            {/* Dismantle */}
            {npcs.rewardSystem?.dismantleRewards ? (() => {
              const dismantle = npcs.rewardSystem.dismantleRewards as Record<string, unknown>
              const breakdown = (dismantle.breakdown ?? {}) as Record<string, string>
              return (
                <div className="bg-surface-hover rounded-lg p-3 mb-4">
                  <h4 className="text-foreground font-medium text-sm mb-2">🔨 Dismantle Rewards</h4>
                  <p className="text-foreground-secondary text-sm mb-2">{dismantle.description as string}</p>
                  <p className="text-foreground-muted text-xs mb-2">Total value: {dismantle.totalValue as string}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs">
                    {Object.entries(breakdown).map(([key, val]) => (
                      <div key={key} className="flex justify-between bg-surface rounded p-1.5">
                        <span className="text-foreground-secondary">{key}</span>
                        <span className="text-accent">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })() : null}

            {/* Powerup drops */}
            {npcs.rewardSystem?.powerupDrops ? (() => {
              const drops = npcs.rewardSystem.powerupDrops as Record<string, unknown>
              return (
                <div className="bg-surface-hover rounded-lg p-3 mb-4">
                  <h4 className="text-foreground font-medium text-sm mb-2">⚡ Powerup Drops</h4>
                  <p className="text-foreground-secondary text-sm mb-2">{drops.description as string}</p>
                  <p className="text-foreground-muted text-xs mb-2">{drops.dropLogic as string}</p>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    {['speedDrop', 'armorDrop', 'commonDrop'].map(key => {
                      const drop = drops[key] as Record<string, unknown> | undefined
                      if (!drop) return null
                      return (
                        <div key={key} className="bg-surface rounded-lg p-2">
                          <span className="text-foreground font-medium block mb-1">
                            {key === 'speedDrop' ? '⚡ Speed' : key === 'armorDrop' ? '🛡️ Armor' : '📦 Common'}
                          </span>
                          <span className="text-foreground-muted block">{drop.condition as string}</span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-foreground-muted text-xs mt-2">Size scaling: {drops.sizeScaling as string}</p>
                </div>
              )
            })() : null}

            {/* Ammo drops */}
            {npcs.rewardSystem?.cannonballDrops ? (() => {
              const drops = npcs.rewardSystem.cannonballDrops as Record<string, string>
              return (
                <div className="bg-surface-hover rounded-lg p-3 mb-4">
                  <h4 className="text-foreground font-medium text-sm mb-2">💣 Ammo Drops</h4>
                  <div className="grid gap-1 text-sm">
                    <p className="text-foreground-secondary text-xs">Chance: {drops.chance}</p>
                    <p className="text-foreground-secondary text-xs">Amount: {drops.amount}</p>
                    <p className="text-foreground-secondary text-xs">Type: {drops.typeSelection}</p>
                  </div>
                </div>
              )
            })() : null}

            {/* Reward formulas */}
            {npcs.rewardSystem?.basicRewardFormula ? (
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-foreground font-medium text-sm mb-2">📊 Reward Formulas</h4>
                <div className="grid gap-1 text-xs">
                  {Object.entries(npcs.rewardSystem.basicRewardFormula as Record<string, string>).map(([key, val]) => {
                    const names: Record<string, string> = {
                      goldCalculation: '💰 Gold',
                      xpCalculation: '⭐ XP',
                      combatBonus: '⚔️ Combat Bonus',
                      damageBonus: '💥 Damage Bonus',
                      cannonBalls: '💣 Ammo',
                    }
                    return (
                      <div key={key} className="bg-surface rounded p-1.5">
                        <span className="text-accent font-medium">{names[key] ?? key}:</span>{' '}
                        <span className="text-foreground-secondary">{val}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Section 5: Crew Count & Wanted Level */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">👥 NPC Crew Count & Wanted Level</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Crew count */}
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-foreground font-medium text-sm mb-2">👥 Crew Count</h4>
                <p className="text-foreground-secondary text-sm mb-2">{npcs.npcCrewCount?.description}</p>
                <code className="text-cyan-400 text-xs block mb-2">{npcs.npcCrewCount?.formula}</code>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-foreground-secondary">Min HP input: {npcs.npcCrewCount?.inputHP}</span>
                  <span className="text-foreground-secondary">Cap: {npcs.npcCrewCount?.cap}</span>
                </div>
              </div>

              {/* Wanted level */}
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-foreground font-medium text-sm mb-2">🎯 Wanted Level</h4>
                <p className="text-foreground-secondary text-sm mb-2">
                  {(npcs.wantedLevel as Record<string, unknown>)?.description as string ?? 'Attacking NPCs raises your wanted level.'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  {[1, 2, 3].map(level => (
                    <div key={level} className="bg-surface rounded p-2">
                      <span className="text-foreground-muted block">Level {level}</span>
                      <span className="text-foreground font-medium">{(20 - level * 5)} min</span>
                      <span className="text-foreground-muted block">between hunters</span>
                    </div>
                  ))}
                </div>
                {(npcs.wantedLevel as Record<string, unknown>)?.tradingRouteBonus ? (
                  <p className="text-foreground-muted text-xs mt-2">
                    📝 {(npcs.wantedLevel as Record<string, unknown>).tradingRouteBonus as string}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Procedural NPCs — condensed */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">👻 Procedural NPCs</h3>
            <p className="text-foreground-secondary text-sm mb-3">Dynamically generated NPCs in each Water Hazard level.</p>
            <div className="grid gap-3">
              {Object.entries(npcs.proceduralNpcs).map(([key, npc]) => (
                <div key={key} className="bg-surface-hover rounded-lg p-3">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h4 className="text-foreground font-medium">{npc.name || key}</h4>
                    {npc.count ? <Badge color="blue" text={`${npc.count} per WH level`} /> : null}
                    {npc.visual ? <Badge color="purple" text={VISUAL_NAMES[npc.visual] ?? npc.visual} /> : null}
                  </div>
                  {npc.shipClasses ? (
                    <p className="text-foreground-secondary text-xs mb-1">Ships: {npc.shipClasses.map(c => SHIP_CLASS_NAMES[c] ?? c).join(', ')}</p>
                  ) : null}
                  {npc.notes ? <p className="text-foreground-muted text-xs italic">📝 {npc.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
