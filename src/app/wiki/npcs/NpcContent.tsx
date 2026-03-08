'use client'

import { useState, useMemo } from 'react'

interface NpcType {
  typeId: string
  enumValue: number
  displayName: string
  category: string
  description: string
  behavior?: Record<string, boolean>
  icon?: string
  flag?: string
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

interface NpcData {
  npcTypes: NpcType[]
  bosses: Boss[]
  captureSystem: Record<string, unknown>
  rewardSystem: Record<string, unknown>
  spawnMechanics: Record<string, unknown>
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
  DestroyedShip: 'Destroyed Ship',
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

const BOSS_TYPE_NAMES: Record<string, string> = {
  Empire_Legendary2l: 'Imperial Legend (2★)',
  Empire_Legendary3l: 'Imperial Legend (3★)',
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

const CATEGORY_LABELS: Record<string, string> = {
  pirate: '🏴‍☠️ Pirate',
  empire: '👑 Empire',
  trader: '🪙 Trader',
  other: '⚓ Other',
}

const SERVER_EFFECTS: Record<number, string> = {
  1: 'Special visual effect',
  2: 'Explosive aura',
}

function renderBehavior(behavior?: Record<string, boolean>) {
  if (!behavior) return null
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {behavior.aggressive ? (
        <Badge color="red" text="⚔️ Aggressive — will attack on sight" />
      ) : null}
      {behavior.attacksPlayers && !behavior.aggressive ? (
        <Badge color="orange" text="🎯 Attacks players" />
      ) : null}
      {!behavior.aggressive && !behavior.attacksPlayers ? (
        <Badge color="green" text="🕊️ Peaceful — will not attack" />
      ) : null}
      {behavior.canBeCaptured ? (
        <Badge color="green" text="🏴 Can be captured via boarding" />
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
        <Badge color="orange" text="🔥 Can extinguish fires" />
      ) : null}
    </div>
  )
}

export default function NpcContent({ npcs }: { npcs: NpcData }) {
  const [tab, setTab] = useState<'bosses' | 'types' | 'rewards'>('bosses')
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const [tierFilter, setTierFilter] = useState<string>('all')

  // Split bosses by tier
  const bosses2Star = useMemo(() => npcs.bosses.filter(b => b.tier === '2-star').sort((a, b) => a.hp - b.hp), [npcs.bosses])
  const bosses3Star = useMemo(() => npcs.bosses.filter(b => b.tier === '3-star').sort((a, b) => a.hp - b.hp), [npcs.bosses])

  const filteredBosses = useMemo(() => {
    if (tierFilter === '2-star') return bosses2Star
    if (tierFilter === '3-star') return bosses3Star
    return [...bosses2Star, ...bosses3Star]
  }, [tierFilter, bosses2Star, bosses3Star])

  // Filter NPC types — exclude removed ones
  const activeNpcTypes = useMemo(() =>
    npcs.npcTypes.filter(n => !n.typeId.startsWith('Rem_')),
    [npcs.npcTypes]
  )

  const lootByType = (npcs.rewardSystem?.lootByType ?? {}) as Record<string, unknown>
  const captureSystem = npcs.captureSystem ?? {}

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setTab('bosses')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'bosses' ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
          }`}
        >
          🏴‍☠️ Named Bosses ({npcs.bosses.length})
        </button>
        <button
          onClick={() => setTab('types')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'types' ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
          }`}
        >
          ⚓ NPC Types ({activeNpcTypes.length})
        </button>
        <button
          onClick={() => setTab('rewards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'rewards' ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
          }`}
        >
          💰 Rewards & Capture
        </button>
      </div>

      {/* ─── BOSSES TAB ─── */}
      {tab === 'bosses' && (
        <div>
          {/* Tier filter */}
          <div className="flex gap-2 mb-4">
            {['all', '2-star', '3-star'].map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tierFilter === tier ? 'bg-primary text-primary-foreground' : 'bg-surface text-foreground-secondary hover:text-foreground'
                }`}
              >
                {tier === 'all' ? 'All Bosses' : TIER_LABELS[tier]}
              </button>
            ))}
          </div>

          {/* Boss info banner */}
          <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 text-sm text-foreground-secondary">
            <p>Named bosses are powerful Imperial Legends that roam the seas. <strong className="text-blue-400">2-Star</strong> bosses
            spawn across multiple regions, while <strong className="text-purple-400">3-Star</strong> bosses only appear in the
            highest-level Deep Waters region. Defeating bosses rewards large amounts of Escudo and rare loot.</p>
          </div>

          <div className="grid gap-4">
            {filteredBosses.map(boss => {
              const dps = boss.reloadSec > 0 ? boss.damagePerShot / boss.reloadSec : 0
              const range = boss.cannonDistOverride ?? '?'
              const isExpanded = expandedBoss === boss.name

              return (
                <div
                  key={boss.name}
                  className="bg-surface border border-surface-border rounded-xl overflow-hidden"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedBoss(isExpanded ? null : boss.name)}
                    className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-foreground font-semibold text-lg">{boss.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${TIER_COLORS[boss.tier] ?? 'text-foreground-secondary'} bg-surface-hover`}>
                        {TIER_LABELS[boss.tier] ?? boss.tier}
                      </span>
                      {boss.defenseWaves.length > 0 && (
                        <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">Has Escorts</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
                      <span className="text-red-400 font-medium">❤️ {boss.hp.toLocaleString()}</span>
                      <span className="text-foreground-secondary">🚢 {boss.shipName}</span>
                      <span className="text-accent font-medium">⚔️ {dps.toFixed(1)} DPS</span>
                      <span className="text-foreground-muted">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-surface-border pt-3">
                      {/* Core stat cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-sm mb-4">
                        <StatCard label="Hit Points" value={boss.hp.toLocaleString()} color="text-red-400" />
                        <StatCard label="Armor" value={String(boss.armor)} />
                        <StatCard label="Speed" value={`${boss.speed} kn`} />
                        <StatCard label="Damage/Shot" value={String(boss.damagePerShot)} />
                        <StatCard label="Reload" value={`${boss.reloadSec}s`} />
                        <StatCard label="DPS" value={dps.toFixed(1)} color="text-accent" />
                      </div>

                      {/* Weapon & combat info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm mb-4">
                        <StatCard label="Weapon Type" value={boss.cannonClass ? CANNON_NAMES[boss.cannonClass] ?? boss.cannonClass : 'Unknown'} />
                        <StatCard label="Range" value={range !== '?' ? `${range}` : 'Standard'} />
                        <StatCard label="Special Ammo" value={
                          boss.specialBalls != null
                            ? AMMO_NAMES[boss.specialBalls] ?? `Type ${boss.specialBalls}`
                            : 'None'
                        } />
                        {boss.overrideCrewCount ? (
                          <StatCard label="Crew Count" value={boss.overrideCrewCount.toLocaleString()} />
                        ) : null}
                      </div>

                      {/* Info tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Tag label="Hull" value={boss.shipName} />
                        <Tag label="Appearance" value={boss.visual ? VISUAL_NAMES[boss.visual] ?? boss.visual : 'Standard'} />
                        <Tag label="Type" value={BOSS_TYPE_NAMES[boss.type] ?? boss.type} />
                        {boss.spawnRegions.length > 0 && (
                          <Tag label="Spawn Regions" value={boss.spawnRegions.map(r => REGION_NAMES[r] ?? `Region ${r}`).join(', ')} />
                        )}
                        <Tag label="Fleet" value={
                          boss.fleetSize === 1
                            ? `Solo — ${boss.fleetsPerRegion} per region`
                            : `${boss.fleetSize} ships — ${boss.fleetsPerRegion} fleets/region`
                        } />
                        {boss.specialServerEffect ? (
                          <Tag label="Special Effect" value={SERVER_EFFECTS[boss.specialServerEffect] ?? 'Visual effect'} />
                        ) : null}
                      </div>

                      {/* Defense waves */}
                      {boss.defenseWaves.length > 0 && (
                        <div className="mt-3 bg-surface-hover rounded-lg p-3">
                          <h4 className="text-foreground font-medium text-sm mb-2">🛡️ Escort Ships</h4>
                          <div className="grid gap-2">
                            {boss.defenseWaves.map((wave, i) => (
                              <div key={i} className="flex flex-wrap gap-4 text-sm text-foreground-secondary">
                                <span className="text-foreground font-medium">{wave.count}× {wave.shipName}</span>
                                <span>❤️ {wave.hp.toLocaleString()} HP</span>
                                <span>🛡️ {wave.armor} Armor</span>
                                <span>⚡ {wave.speed} kn</span>
                                <span>⚔️ {wave.damagePerShot} dmg / {(wave.reloadMs / 1000).toFixed(0)}s</span>
                                <span className="text-foreground-muted">({(wave.damagePerShot / (wave.reloadMs / 1000)).toFixed(1)} DPS)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {boss.notes && (
                        <p className="text-foreground-muted text-xs mt-3 italic">📝 {boss.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── NPC TYPES TAB ─── */}
      {tab === 'types' && (
        <div>
          {/* Capture info banner */}
          <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 text-sm text-foreground-secondary">
            <p><strong className="text-green-400">Can capture:</strong> {captureSystem.canCapture as string ?? 'Pirates, Traders, Seafarers, Fanatics'}</p>
            <p className="mt-1"><strong className="text-red-400">Cannot capture:</strong> {captureSystem.cannotCapture as string ?? 'Empire, Port Patrol'}</p>
          </div>

          <div className="grid gap-3">
            {activeNpcTypes.map(npc => {
              const isExpanded = expandedType === npc.typeId
              const catLabel = CATEGORY_LABELS[npc.category] ?? npc.category
              const catColor = CATEGORY_COLORS[npc.category] ?? 'text-foreground-secondary'

              // Get loot info for this type
              const lootCategory = npc.category === 'pirate' ? 'pirates'
                : npc.category === 'trader' ? 'traders'
                : npc.category === 'empire' ? 'empire'
                : npc.typeId === 'Fanatics' ? 'fanatics'
                : npc.typeId === 'Seafarer' ? 'seafarer'
                : npc.typeId.includes('HeadHunter') ? 'bountyHunter'
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
                    <div className="flex items-center gap-3">
                      <h3 className="text-foreground font-medium">{npc.displayName}</h3>
                      <span className={`text-xs font-medium ${catColor}`}>{catLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {npc.behavior?.canBeCaptured && (
                        <span className="text-green-400 text-xs">🏴 Capturable</span>
                      )}
                      {npc.behavior?.aggressive && (
                        <span className="text-red-400 text-xs">⚔️ Hostile</span>
                      )}
                      {npc.behavior && !npc.behavior.aggressive && !npc.behavior.attacksPlayers && (
                        <span className="text-green-400 text-xs">🕊️ Peaceful</span>
                      )}
                      <span className="text-foreground-muted text-sm">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-surface-border pt-3">
                      <p className="text-foreground-secondary text-sm mb-3">{npc.description}</p>

                      {/* Behavior badges */}
                      {renderBehavior(npc.behavior)}

                      {/* Loot info */}
                      {lootInfo != null ? (
                        <div className="bg-surface-hover rounded-lg p-3 mt-2">
                          <h4 className="text-foreground font-medium text-sm mb-2">💰 Loot Drops</h4>
                          {typeof lootInfo === 'string' ? (
                            <p className="text-foreground-secondary text-sm">{lootInfo}</p>
                          ) : (
                            <div className="grid gap-1 text-sm">
                              {Object.entries(lootInfo as Record<string, string>).map(([key, val]) => (
                                <div key={key} className="text-foreground-secondary">
                                  <span className="text-foreground-muted capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                  {val}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── REWARDS TAB ─── */}
      {tab === 'rewards' && (
        <div className="grid gap-4">
          {/* Sinking vs Boarding */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">⚔️ Sinking vs Boarding</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-red-400 font-medium mb-2">💥 Sinking</h4>
                <p className="text-foreground-secondary text-sm">Destroying an NPC ship gives resource drops, gold, cannonball drops, and a chance for powerup items.</p>
              </div>
              <div className="bg-surface-hover rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">🏴 Boarding</h4>
                <p className="text-foreground-secondary text-sm">Boarding lets you capture the ship (if capturable), recruit crew, and access different loot tables.</p>
              </div>
            </div>
          </div>

          {/* Capture rules */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🏴 Capture System</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-green-400 font-medium">Can capture:</span>{' '}
                <span className="text-foreground-secondary">{captureSystem.canCapture as string}</span>
              </div>
              <div>
                <span className="text-red-400 font-medium">Cannot capture:</span>{' '}
                <span className="text-foreground-secondary">{captureSystem.cannotCapture as string}</span>
              </div>
              <div>
                <span className="text-foreground-muted font-medium">How it works:</span>{' '}
                <span className="text-foreground-secondary">{captureSystem.mechanics as string}</span>
              </div>
            </div>
          </div>

          {/* Reward formula */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">📊 Reward Calculations</h3>
            {npcs.rewardSystem?.basicRewardFormula ? (
              <div className="grid gap-2 text-sm">
                {Object.entries(npcs.rewardSystem.basicRewardFormula as Record<string, string>).map(([key, val]) => (
                  <div key={key} className="bg-surface-hover rounded p-2">
                    <span className="text-accent font-medium capitalize block text-xs">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-foreground-secondary">{val}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Dismantle rewards */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🔨 Ship Dismantle Rewards</h3>
            <p className="text-foreground-secondary text-sm mb-2">Resources received from dismantling captured NPC ships:</p>
            {npcs.rewardSystem?.dismantleRewards ? (
              <div className="grid gap-1 text-sm">
                {Object.entries((npcs.rewardSystem.dismantleRewards as Record<string, unknown>).breakdown as Record<string, string> ?? {}).map(([key, val]) => {
                  const name = key.replace(/_res\d+/, '').replace(/_/g, ' ')
                  return (
                    <div key={key} className="flex justify-between bg-surface-hover rounded p-2">
                      <span className="text-foreground capitalize">{name}</span>
                      <span className="text-foreground-secondary">{val}</span>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Wanted Level */}
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-foreground font-semibold text-lg mb-3">🎯 Wanted Level</h3>
            <p className="text-foreground-secondary text-sm">
              Attacking NPCs increases your wanted level. Higher wanted levels cause <strong className="text-red-400">Headhunter</strong> bounty
              hunter NPCs to spawn more frequently. Spawn interval: <span className="text-accent">(20 − wanted level × 5) × 60 seconds</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared components ──

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
    <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
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
  }
  return (
    <span className={`text-xs px-2 py-1 rounded ${colorMap[color] ?? 'bg-surface-hover text-foreground-secondary'}`}>
      {text}
    </span>
  )
}
