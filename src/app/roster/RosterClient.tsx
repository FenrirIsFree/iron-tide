'use client'

import { useState, useTransition } from 'react'
import { getMemberFleet, updateMemberRank } from '@/app/actions/roster'
import { computeModifiedStats, type ModifiedStats } from '@/lib/statEngine'

type Member = {
  id: string
  username: string
  inGameName: string | null
  rank: string
  joinedAt: string
}

type LoadoutWeapon = { id: string; weapon: { name: string; type: string }; position: string; quantity: number }
type LoadoutUpgrade = { id: string; upgrade: { name: string; effects?: { stat: string; value: string; gameKey?: string; rankedValues?: string[] }[] | null; effect?: string | null; category?: string | null } }
type LoadoutAmmo = { id: string; ammoType: { name: string }; quantity: number }
type LoadoutCrew = { id: string; crewType: { name: string }; quantity: number }
type LoadoutConsumable = { id: string; consumable: { name: string }; quantity: number }

type ActiveLoadout = {
  id: string; name: string
  weapons: LoadoutWeapon[]
  upgrades: LoadoutUpgrade[]
  ammo: LoadoutAmmo[]
  crew: LoadoutCrew[]
  consumables: LoadoutConsumable[]
}

type MemberShip = {
  id: string
  nickname: string | null
  ship: {
    name: string; shipClass: string; rate: number; weaponClass: string | null
    broadsideSlots: number; crewCapacity: number | null; role: string | null
    speed: number | null; maneuverability: number | null; broadsideArmor: number | null
    hp: number | null; cargoHold: number | null
    sternSlots: number | null; bowSlots: number | null; mortarSlots: number | null
  }
  loadouts: ActiveLoadout[]
}

const BASIC_CREW = ['Sailor', 'Musketeer', 'Soldier', 'Mercenary']

const rankConfig: Record<string, { label: string; emoji: string; color: string }> = {
  ADMIN: { label: 'Admin', emoji: '🛡️', color: 'text-accent border-accent' },
  FOUNDER: { label: 'Founder', emoji: '👑', color: 'text-accent border-accent' },
  ADMIRAL: { label: 'Admiral', emoji: '⚓', color: 'text-accent border-accent' },
  COMMODORE: { label: 'Commodore', emoji: '🎖️', color: 'text-primary border-primary' },
  OFFICER: { label: 'Officer', emoji: '⚔️', color: 'text-primary border-primary' },
  MIDSHIPMAN: { label: 'Midshipman', emoji: '🔱', color: 'text-foreground-secondary border-surface-border' },
  SAILOR: { label: 'Sailor', emoji: '⛵', color: 'text-foreground-secondary border-surface-border' },
  CABIN_BOY: { label: 'Cabin Boy', emoji: '🧹', color: 'text-foreground-secondary border-surface-border' },
}

const RANK_ORDER: Record<string, number> = {
  FOUNDER: 0, ADMIRAL: 1, COMMODORE: 2, OFFICER: 3, MIDSHIPMAN: 4, SAILOR: 5, CABIN_BOY: 6,
}
const ALL_RANKS = ['ADMIRAL', 'COMMODORE', 'OFFICER', 'MIDSHIPMAN', 'SAILOR', 'CABIN_BOY'] as const

export default function RosterClient({ members, currentUserId, currentUserRank }: { members: Member[]; currentUserId: string; currentUserRank: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fleet, setFleet] = useState<MemberShip[]>([])
  const [isPending, startTransition] = useTransition()
  const [editingRankId, setEditingRankId] = useState<string | null>(null)

  const myRankLevel = RANK_ORDER[currentUserRank] ?? 99
  // Can manage ranks if you're Officer or above (level 3 or lower)
  const canManageRanks = myRankLevel <= 3

  function handleRankChange(targetId: string, newRank: string) {
    startTransition(async () => {
      try {
        await updateMemberRank(targetId, newRank)
        setEditingRankId(null)
      } catch (e: unknown) {
        alert(e instanceof Error ? e.message : 'Failed to update rank')
      }
    })
  }

  function handleViewFleet(userId: string) {
    if (selectedId === userId) {
      setSelectedId(null)
      setFleet([])
      return
    }
    setSelectedId(userId)
    startTransition(async () => {
      const result = await getMemberFleet(userId)
      setFleet(JSON.parse(JSON.stringify(result)))
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">👥 Guild Roster</h1>

      {members.length === 0 ? (
        <p className="text-foreground-secondary text-center py-20">No public members found.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => {
            const rc = rankConfig[m.rank] ?? rankConfig.CABIN_BOY
            const isMe = m.id === currentUserId
            const isExpanded = selectedId === m.id
            const targetRankLevel = RANK_ORDER[m.rank] ?? 99
            // Can edit if: you outrank them, they're not you, and you're Officer+
            const canEditThisRank = canManageRanks && !isMe && myRankLevel < targetRankLevel
            const isEditingRank = editingRankId === m.id
            // Available ranks: only ranks below yours
            const availableRanks = ALL_RANKS.filter(r => {
              const level = RANK_ORDER[r]
              // Must be below your rank
              if (level <= myRankLevel) return false
              // Only Founder can set Admiral
              if (r === 'ADMIRAL' && currentUserRank !== 'FOUNDER') return false
              return true
            })

            return (
              <div key={m.id} className={`bg-surface border rounded-xl overflow-hidden ${isMe ? 'border-accent' : 'border-surface-border'}`}>
                <div
                  className="p-4 cursor-pointer hover:bg-background/50 transition-colors flex items-center justify-between"
                  onClick={() => handleViewFleet(m.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-semibold">
                          {m.username}
                          {isMe && <span className="text-accent text-xs ml-1">(you)</span>}
                        </span>
                        {isEditingRank ? (
                          <select
                            value={m.rank}
                            onClick={e => e.stopPropagation()}
                            onChange={e => { e.stopPropagation(); handleRankChange(m.id, e.target.value) }}
                            onBlur={() => setEditingRankId(null)}
                            autoFocus
                            className="text-xs bg-surface border border-accent rounded px-2 py-0.5 text-foreground focus:outline-none"
                          >
                            <option value={m.rank}>{rc.emoji} {rc.label} (current)</option>
                            {availableRanks.filter(r => r !== m.rank).map(r => {
                              const rrc = rankConfig[r]
                              return <option key={r} value={r}>{rrc.emoji} {rrc.label}</option>
                            })}
                          </select>
                        ) : (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${rc.color} ${canEditThisRank ? 'cursor-pointer hover:ring-1 hover:ring-accent' : ''}`}
                            onClick={e => { if (canEditThisRank) { e.stopPropagation(); setEditingRankId(m.id) } }}
                            title={canEditThisRank ? 'Click to change rank' : undefined}
                          >
                            {rc.emoji} {rc.label}
                          </span>
                        )}
                      </div>
                      {m.inGameName && (
                        <p className="text-sm text-foreground-secondary mt-0.5">IGN: {m.inGameName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-foreground-secondary">
                      Member since {new Date(m.joinedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-foreground-secondary mt-0.5">{isExpanded ? '▲ Hide Fleet' : '▼ View Fleet'}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-surface-border p-4">
                    {isPending ? (
                      <p className="text-sm text-foreground-secondary">Loading fleet…</p>
                    ) : fleet.length === 0 ? (
                      <p className="text-sm text-foreground-secondary">No public ships.</p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {fleet.map((s) => {
                          const loadout = s.loadouts[0]
                          // Compute modified stats
                          const modStats: ModifiedStats | null = loadout ? computeModifiedStats(
                            {
                              hp: s.ship.hp, speed: s.ship.speed, maneuverability: s.ship.maneuverability,
                              broadsideArmor: s.ship.broadsideArmor, cargoHold: s.ship.cargoHold,
                              crewCapacity: s.ship.crewCapacity, integrity: null,
                              broadsideSlots: s.ship.broadsideSlots, mortarSlots: s.ship.mortarSlots ?? 0,
                              rate: s.ship.rate,
                            },
                            loadout.upgrades,
                            loadout.crew,
                          ) : null

                          const portWeapons = loadout?.weapons.filter(w => w.position === 'port') || []
                          const starboardWeapons = loadout?.weapons.filter(w => w.position === 'starboard') || []
                          const sternWeapons = loadout?.weapons.filter(w => w.position === 'stern') || []
                          const bowWeapons = loadout?.weapons.filter(w => w.position === 'bow') || []
                          const mortarWeapons = loadout?.weapons.filter(w => w.position === 'mortar') || []
                          const basicCrew = loadout?.crew.filter(c => BASIC_CREW.includes(c.crewType.name)) || []
                          const specialCrew = loadout?.crew.filter(c => !BASIC_CREW.includes(c.crewType.name)) || []

                          return (
                            <div key={s.id} className="bg-background/50 rounded-lg p-3 space-y-2">
                              <div>
                                <h4 className="font-medium text-foreground text-sm">
                                  {s.ship.name}
                                  {s.nickname && <span className="text-accent ml-1">&ldquo;{s.nickname}&rdquo;</span>}
                                </h4>
                                <p className="text-xs text-foreground-secondary">
                                  {s.ship.shipClass} · Rate {s.ship.rate} · {s.ship.role || '?'}
                                </p>
                              </div>

                              {/* Ship Stats — show modified if loadout exists */}
                              <div className="grid grid-cols-5 gap-1 text-xs">
                                <RosterStat label="SPD" base={s.ship.speed} modified={modStats?.speed} />
                                <RosterStat label="MANEUV" base={s.ship.maneuverability} modified={modStats?.maneuverability} />
                                <RosterStat label="ARM" base={s.ship.broadsideArmor} modified={modStats?.broadsideArmor} />
                                <RosterStat label="DUR" base={s.ship.hp} modified={modStats?.hp} />
                                <RosterStat label="CARGO" base={s.ship.cargoHold} modified={modStats?.cargoHold} />
                              </div>

                              {/* Slots Summary */}
                              <p className="text-xs text-foreground-secondary">
                                🔫 {s.ship.broadsideSlots}/side
                                {(s.ship.sternSlots ?? 0) > 0 && <span> · Stern {s.ship.sternSlots}</span>}
                                {(s.ship.bowSlots ?? 0) > 0 && <span> · Bow {s.ship.bowSlots}</span>}
                                {(s.ship.mortarSlots ?? 0) > 0 && <span> · Mortar {s.ship.mortarSlots}</span>}
                                {s.ship.crewCapacity && <span> · 👥 {s.ship.crewCapacity}</span>}
                              </p>

                              {loadout && (
                                <div className="space-y-1 text-xs text-foreground-secondary border-t border-surface-border pt-2">
                                  <p className="text-accent font-medium">{loadout.name}</p>
                                  {portWeapons.length > 0 && (
                                    <p>⚔️ Port: {portWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
                                  )}
                                  {starboardWeapons.length > 0 && (
                                    <p>⚔️ Starboard: {starboardWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
                                  )}
                                  {sternWeapons.length > 0 && (
                                    <p>🔙 Stern: {sternWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
                                  )}
                                  {bowWeapons.length > 0 && (
                                    <p>🔜 Bow: {bowWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
                                  )}
                                  {mortarWeapons.length > 0 && (
                                    <p>💣 Mortar: {mortarWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
                                  )}
                                  {loadout.upgrades.length > 0 && (
                                    <p>🛡️ {loadout.upgrades.map(u => u.upgrade.name).join(', ')}</p>
                                  )}
                                  {basicCrew.length > 0 && (
                                    <p>👥 {basicCrew.map(c => `${c.crewType.name} x${c.quantity}`).join(', ')}</p>
                                  )}
                                  {specialCrew.length > 0 && (
                                    <p>⭐ {specialCrew.map(c => c.crewType.name).join(', ')}</p>
                                  )}
                                  {loadout.ammo.filter(a => a.quantity > 0).length > 0 && (
                                    <p>🔴 {loadout.ammo.filter(a => a.quantity > 0).map(a => `${a.ammoType.name} x${a.quantity}`).join(', ')}</p>
                                  )}
                                  {loadout.consumables.filter(c => c.quantity > 0).length > 0 && (
                                    <p>🧪 {loadout.consumables.filter(c => c.quantity > 0).map(c => `${c.consumable.name} x${c.quantity}`).join(', ')}</p>
                                  )}
                                  {!portWeapons.length && !starboardWeapons.length && !sternWeapons.length && !bowWeapons.length && !loadout.upgrades.length && !basicCrew.length && !loadout.ammo.some(a => a.quantity > 0) && !loadout.consumables.some(c => c.quantity > 0) && (
                                    <p className="text-foreground-secondary/50">No loadout configured</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RosterStat({ label, base, modified }: { label: string; base: number | null; modified?: number | null }) {
  const display = modified ?? base
  const changed = modified != null && base != null && Math.abs(modified - base) > 0.01
  const isBuff = changed && modified! > base!
  const isNerf = changed && modified! < base!
  return (
    <div className="text-center">
      <span className="text-foreground-secondary block">{label}</span>
      <span className={`font-medium ${isNerf ? 'text-red-400' : isBuff ? 'text-green-400' : 'text-foreground'}`}>
        {display != null ? (Number.isInteger(display) ? display : display.toFixed(1)) : '—'}
      </span>
    </div>
  )
}
