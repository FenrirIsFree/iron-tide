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

const REGION_NAMES: Record<number, string> = {
  1: 'Deep Waters (Highest)',
  2: 'Region 2',
  3: 'Region 3',
  4: 'Region 4',
  5: 'Region 5',
  6: 'Region 6',
  7: 'Region 7',
  8: 'Region 8 (Starter)',
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

// ── Main Component ──

export default function NpcContent({ npcs }: { npcs: NpcData }) {
  const [tab, setTab] = useState<'bosses' | 'types' | 'spawns' | 'rewards'>('bosses')
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

  // Exclude removed NPC types
  const activeNpcTypes = useMemo(() =>
    npcs.npcTypes.filter(n => !n.typeId.startsWith('Rem_')),
    [npcs.npcTypes]
  )

  // Group NPC types by category
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
          { id: 'bosses' as const, label: `🏴‍☠️ Named Bosses (${npcs.bosses.length})` },
          { id: 'types' as const, label: `⚓ NPC Types (${activeNpcTypes.length})` },
          { id: 'spawns' as const, label: '🌊 Spawns & World' },
          { id: 'rewards' as const, label: '💰 Rewards & Loot' },
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
      {tab === 'bosses' && (
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
              <p>Imperial Flagships that spawn across <strong>multiple regions</strong>. Moderate difficulty — good for farming Escudo. 5-minute respawn timer. Can extinguish fires and resist collision damage.</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-medium mb-1">⭐⭐⭐ 3-Star Bosses ({bosses3Star.length})</h4>
              <p>Imperial Legends — the most powerful NPCs in the game. Only spawn in <strong>Deep Waters</strong> (highest region). <strong>12-hour respawn</strong>. Drop loot chests with large Escudo, Copper, and Voodoo Skulls. Hidden crew counts.</p>
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

                  {isExpanded && (
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
                        <Tag label="Spawn Regions" value={boss.spawnRegions.map(r => REGION_NAMES[r] ?? `Region ${r}`).join(', ')} />
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

                      {/* Total encounter damage */}
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

                      {/* Notes */}
                      {boss.notes ? (
                        <p className="text-foreground-muted text-xs mt-3 italic">📝 {boss.notes}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════ NPC TYPES TAB ═══════════════════ */}
      {tab === 'types' && (
        <div>
          {/* Capture rules banner */}
          <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 text-sm">
            <h3 className="text-foreground font-semibold mb-2">🏴 Capture Rules</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <span className="text-green-400 font-medium">Can capture:</span>
                <p className="text-foreground-secondary mt-1">{npcs.captureSystem?.canCapture ?? 'Pirates, Traders, Seafarers, Fanatics'}</p>
              </div>
              <div>
                <span className="text-red-400 font-medium">Cannot capture:</span>
                <p className="text-foreground-secondary mt-1">{npcs.captureSystem?.cannotCapture ?? 'Empire, Port Patrol'}</p>
              </div>
            </div>
            <p className="text-foreground-muted text-xs mt-2">{npcs.captureSystem?.captureRule}</p>
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
                    const lootCategory = npc.category === 'pirate' ? 'pirates'
                      : npc.category === 'trader' ? 'traders'
                      : npc.category === 'empire' ? 'empire'
                      : npc.typeId === 'Fanatics' ? 'fanatics'
                      : npc.typeId === 'Seafarer' ? 'seafarer'
                      : npc.typeId.includes('HeadHunter') ? 'bountyHunter'
                      : npc.typeId === 'NyEventNpc' ? 'nyEventNpc'
                      : null
                    const lootInfo = lootCategory ? lootByType[lootCategory] : null

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
                              <span className="text-green-400 text-xs">🏴 Capturable</span>
                            ) : null}
                            {npc.behavior?.aggressive ? (
                              <span className="text-red-400 text-xs">⚔️ Hostile</span>
                            ) : null}
                            {npc.behavior && !npc.behavior.aggressive && !npc.behavior.attacksPlayers ? (
                              <span className="text-green-400 text-xs">🕊️ Peaceful</span>
                            ) : null}
                            {npc.behavior?.showOnWorldMap ? (
                              <span className="text-blue-400 text-xs">🗺️ On Map</span>
                            ) : null}
                          </div>
                          <span className="text-foreground-muted text-sm">{isExpanded ? '▲' : '▼'}</span>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-surface-border pt-3">
                            <p className="text-foreground-secondary text-sm mb-3">{npc.description}</p>

                            {/* Behavior badges */}
                            {renderBehavior(npc.behavior)}

                            {/* Quick stats */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {npc.flag && npc.flag !== 'NoFlag' ? (
                                <Tag label="Flag" value={FLAG_NAMES[npc.flag] ?? npc.flag} />
                              ) : null}
                              {npc.shipClasses ? (
                                <Tag label="Ship Classes" value={npc.shipClasses.map(c => SHIP_CLASS_NAMES[c] ?? c).join(', ')} />
                              ) : null}
                              {npc.namePool ? (
                                <Tag label="Name Pool" value={npc.namePool.replace(/Names?$/, '').replace(/([A-Z])/g, ' $1').trim()} />
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
                              {npc.spawnPerPort ? (
                                <Tag label="Per Port" value={npc.spawnPerPort} />
                              ) : null}
                              {npc.lifetime ? (
                                <Tag label="Lifetime" value={String(npc.lifetime)} />
                              ) : null}
                              {npc.respawnIntervalMin ? (
                                <Tag label="Respawn" value={npc.respawnIntervalMin >= 60 ? `${npc.respawnIntervalMin / 60} hours` : `${npc.respawnIntervalMin} min`} />
                              ) : null}
                              {npc.hasDefenseWaves ? (
                                <Tag label="Defense Waves" value={npc.defenseWaveCount ?? 'Yes'} />
                              ) : null}
                              {npc.powerupItemChance ? (
                                <Tag label="Powerup Drop Chance" value={`${npc.powerupItemChance}%`} />
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
                                      .replace(/([A-Z])/g, ' $1')
                                      .replace(/Multiplier/, '×')
                                      .replace(/Bonus/, '+')
                                      .replace(/Reduction/, '−')
                                      .trim()
                                    return (
                                      <span key={key} className="bg-surface text-foreground-secondary text-xs px-2 py-1 rounded">
                                        {label}: <span className="text-accent">{String(val)}</span>
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
                              <InfoSection title="🚢 Ship Selection by Region">
                                <p className="text-foreground-secondary text-sm">{npc.portShipSelection}</p>
                              </InfoSection>
                            ) : null}

                            {/* Loot info */}
                            {lootInfo != null ? (
                              <InfoSection title="💰 Loot Drops">
                                {typeof lootInfo === 'string' ? (
                                  <p className="text-foreground-secondary text-sm">{lootInfo}</p>
                                ) : (
                                  <div className="grid gap-2 text-sm">
                                    {Object.entries(lootInfo as Record<string, string>).map(([key, val]) => (
                                      <div key={key}>
                                        <span className="text-foreground font-medium capitalize">{key.replace(/_/g, ' ').replace(/fr[12]/, '').replace('fleet ', 'Fleet: ')}:</span>{' '}
                                        <span className="text-foreground-secondary">{val}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </InfoSection>
                            ) : null}

                            {/* Notes */}
                            {npc.notes ? (
                              <p className="text-foreground-muted text-xs mt-3 italic">📝 {npc.notes}</p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════════════ SPAWNS TAB ═══════════════════ */}
      {tab === 'spawns' && (
        <div className="grid gap-4">
          {/* Spawn mechanics */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🌊 Region Spawning</h3>
            {npcs.spawnMechanics?.regionSpawning ? (
              <div className="grid gap-2 text-sm">
                {Object.entries(npcs.spawnMechanics.regionSpawning as Record<string, string>).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-accent font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                    <span className="text-foreground-secondary">{val}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Procedural NPCs */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">👻 Procedural NPCs</h3>
            <p className="text-foreground-secondary text-sm mb-3">These NPCs are generated dynamically in each region.</p>
            <div className="grid gap-3">
              {Object.entries(npcs.proceduralNpcs).map(([key, npc]) => (
                <div key={key} className="bg-surface-hover rounded-lg p-3">
                  <h4 className="text-foreground font-medium mb-2">{npc.name || key}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {npc.count ? <Tag label="Count per Region" value={String(npc.count)} /> : null}
                    {npc.visual ? <Tag label="Appearance" value={VISUAL_NAMES[npc.visual] ?? npc.visual} /> : null}
                    {npc.shipClasses ? <Tag label="Ship Classes" value={npc.shipClasses.map(c => SHIP_CLASS_NAMES[c] ?? c).join(', ')} /> : null}
                    {npc.spawnIntervalMin ? <Tag label="Spawn Interval" value={`${npc.spawnIntervalMin} min`} /> : null}
                  </div>
                  {npc.statModifiers ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(npc.statModifiers).map(([k, v]) => (
                        <span key={k} className="text-xs text-foreground-secondary bg-surface px-2 py-0.5 rounded">
                          {k.replace(/([A-Z])/g, ' $1').trim()}: <span className="text-accent">{String(v)}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {npc.specialBalls ? <p className="text-foreground-muted text-xs">Special ammo: {npc.specialBalls}</p> : null}
                  {npc.notes ? <p className="text-foreground-muted text-xs italic mt-1">📝 {npc.notes}</p> : null}
                </div>
              ))}
            </div>
          </div>

          {/* Ship name pools */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">📜 NPC Ship Names</h3>
            <p className="text-foreground-secondary text-sm mb-3">NPCs are randomly assigned names from pools based on their type.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(npcs.npcShipNames).map(([pool, names]) => (
                <div key={pool} className="bg-surface-hover rounded-lg p-3">
                  <h4 className="text-foreground font-medium capitalize mb-1">
                    {pool.replace(/([A-Z])/g, ' $1').trim()} <span className="text-foreground-muted font-normal">({names.length} names)</span>
                  </h4>
                  <p className="text-foreground-secondary text-xs leading-relaxed">
                    {names.slice(0, 8).join(', ')}{names.length > 8 ? `, +${names.length - 8} more...` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Crew count formula */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">👥 NPC Crew Count</h3>
            <p className="text-foreground-secondary text-sm mb-2">{npcs.npcCrewCount?.description}</p>
            <div className="bg-surface-hover rounded-lg p-3">
              <code className="text-cyan-400 text-xs block mb-2">{npcs.npcCrewCount?.formula}</code>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-foreground-secondary">Minimum HP input: {npcs.npcCrewCount?.inputHP}</span>
                <span className="text-foreground-secondary">Cap: {npcs.npcCrewCount?.cap}</span>
              </div>
            </div>
          </div>

          {/* Wanted level */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🎯 Wanted Level</h3>
            <p className="text-foreground-secondary text-sm mb-2">
              Attacking NPCs increases your wanted level. Higher levels cause Bounty Hunters to spawn more aggressively.
            </p>
            <div className="bg-surface-hover rounded-lg p-3">
              <p className="text-sm text-foreground-secondary">
                <span className="text-accent font-medium">Bounty Hunter spawn interval:</span>{' '}
                <code className="text-cyan-400">(20 − wantedLevel × 5) × 60 seconds</code>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-center">
                {[1, 2, 3].map(level => (
                  <div key={level} className="bg-surface rounded p-2">
                    <span className="text-foreground-muted block">Level {level}</span>
                    <span className="text-foreground font-medium">{(20 - level * 5)} min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tutorial NPCs */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">📚 Tutorial NPCs</h3>
            <p className="text-foreground-secondary text-sm mb-3">NPCs encountered during the tutorial and education maps.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-foreground-secondary text-left border-b border-surface-border">
                    <th className="pb-2 pr-3">Name</th>
                    <th className="pb-2 pr-3">Ship</th>
                    <th className="pb-2 pr-3">HP</th>
                    <th className="pb-2 pr-3">Speed</th>
                    <th className="pb-2 pr-3">Damage</th>
                    <th className="pb-2 pr-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {npcs.educationMapNpcs.map((npc, i) => (
                    <tr key={i} className="border-b border-surface-border/50">
                      <td className="py-2 pr-3 text-foreground font-medium">{npc.name}</td>
                      <td className="py-2 pr-3 text-foreground-secondary">{npc.shipName}</td>
                      <td className="py-2 pr-3 text-red-400">{npc.hp}</td>
                      <td className="py-2 pr-3 text-foreground-secondary">{npc.speed} kn</td>
                      <td className="py-2 pr-3 text-foreground-secondary">{npc.damagePerShot}</td>
                      <td className="py-2 pr-3 text-foreground-muted">
                        {npc.scenario === 'BattleEnemies' ? '🎯 Enemy' : npc.scenario === 'BattleAllies' ? '🤝 Ally' : npc.scenario === 'FirstShip' ? '📚 First Battle' : npc.scenario}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ REWARDS TAB ═══════════════════ */}
      {tab === 'rewards' && (
        <div className="grid gap-4">
          {/* Sinking vs Boarding */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">⚔️ Sinking vs Boarding</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">💥 Sinking</h4>
                <p className="text-foreground-secondary text-sm">Destroying an NPC ship drops resources, gold, cannonball ammo, and has a chance for powerup consumable items.</p>
              </div>
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">🏴 Boarding & Capture</h4>
                <p className="text-foreground-secondary text-sm">Boarding lets you capture the ship (if capturable), recruit crew, and access different loot tables. Captured ships can be dismantled for resources.</p>
              </div>
            </div>
          </div>

          {/* Loot by type */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">💎 Loot Drops by NPC Type</h3>
            <div className="grid gap-3">
              {Object.entries(lootByType).map(([category, loot]) => (
                <div key={category} className="bg-surface-hover rounded-lg p-3">
                  <h4 className="text-foreground font-medium capitalize mb-2">
                    {CATEGORY_ICONS[category] ?? '📦'} {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  {typeof loot === 'string' ? (
                    <p className="text-foreground-secondary text-sm">{loot}</p>
                  ) : (
                    <div className="grid gap-1 text-sm">
                      {Object.entries(loot as Record<string, string>).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-accent capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                          <span className="text-foreground-secondary">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reward formulas */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">📊 Reward Calculations</h3>
            {npcs.rewardSystem?.basicRewardFormula ? (
              <div className="grid gap-2 text-sm">
                {Object.entries(npcs.rewardSystem.basicRewardFormula as Record<string, string>).map(([key, val]) => (
                  <div key={key} className="bg-surface-hover rounded p-2">
                    <span className="text-accent font-medium capitalize block text-xs mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <code className="text-foreground-secondary text-xs">{val}</code>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Powerup drops */}
          {npcs.rewardSystem?.powerupDrops ? (() => {
            const drops = npcs.rewardSystem.powerupDrops as Record<string, unknown>
            return (
              <div className="bg-surface border border-surface-border rounded-xl p-4">
                <h3 className="text-foreground font-semibold text-lg mb-3">⚡ Powerup Item Drops</h3>
                <p className="text-foreground-secondary text-sm mb-3">{drops.description as string}</p>
                <div className="bg-surface-hover rounded-lg p-3 mb-3">
                  <p className="text-sm text-foreground-secondary">{drops.dropLogic as string}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  {['speedDrop', 'armorDrop', 'commonDrop'].map(key => {
                    const drop = drops[key] as Record<string, unknown> | undefined
                    if (!drop) return null
                    return (
                      <div key={key} className="bg-surface-hover rounded-lg p-3">
                        <h4 className="text-foreground font-medium capitalize mb-1">
                          {key === 'speedDrop' ? '⚡ Speed Powerups' : key === 'armorDrop' ? '🛡️ Armor Powerups' : '📦 Common Powerups'}
                        </h4>
                        <p className="text-foreground-muted text-xs mb-1">{drop.condition as string}</p>
                        <p className="text-foreground-secondary text-xs">Ships: {(drop.shipNames as string[]).join(', ')}</p>
                      </div>
                    )
                  })}
                </div>
                <p className="text-foreground-muted text-xs mt-2">Size scaling: {drops.sizeScaling as string}</p>
              </div>
            )
          })() : null}

          {/* Cannonball drops */}
          {npcs.rewardSystem?.cannonballDrops ? (() => {
            const drops = npcs.rewardSystem.cannonballDrops as Record<string, string>
            return (
              <div className="bg-surface border border-surface-border rounded-xl p-4">
                <h3 className="text-foreground font-semibold text-lg mb-3">💣 Ammo Drops</h3>
                <div className="grid gap-2 text-sm">
                  {Object.entries(drops).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-accent font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                      <span className="text-foreground-secondary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })() : null}

          {/* Dismantle rewards */}
          {npcs.rewardSystem?.dismantleRewards ? (() => {
            const dismantle = npcs.rewardSystem.dismantleRewards as Record<string, unknown>
            const breakdown = (dismantle.breakdown ?? {}) as Record<string, string>
            return (
              <div className="bg-surface border border-surface-border rounded-xl p-4">
                <h3 className="text-foreground font-semibold text-lg mb-3">🔨 Ship Dismantle Rewards</h3>
                <p className="text-foreground-secondary text-sm mb-2">{dismantle.description as string}</p>
                <p className="text-foreground-muted text-xs mb-3">Total value: {dismantle.totalValue as string}</p>
                <div className="grid gap-1 text-sm">
                  {Object.entries(breakdown).map(([key, val]) => {
                    const name = key.replace(/_res\d+/, '').replace(/_/g, ' ')
                    return (
                      <div key={key} className="flex justify-between bg-surface-hover rounded p-2">
                        <span className="text-foreground capitalize">{name}</span>
                        <span className="text-accent">{val}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })() : null}
        </div>
      )}
    </div>
  )
}
