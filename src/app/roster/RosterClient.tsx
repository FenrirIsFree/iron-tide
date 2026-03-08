'use client'

import { useState, useTransition } from 'react'
import { getMemberFleet } from '@/app/actions/roster'

type Member = {
  id: string
  username: string
  inGameName: string | null
  rank: string
  joinedAt: string
}

type LoadoutWeapon = { id: string; weapon: { name: string; type: string }; position: string; quantity: number }
type LoadoutUpgrade = { id: string; upgrade: { name: string } }
type LoadoutAmmo = { id: string; ammoType: { name: string }; quantity: number }
type LoadoutCrew = { id: string; crewType: { name: string }; quantity: number }

type ActiveLoadout = {
  id: string; name: string
  weapons: LoadoutWeapon[]
  upgrades: LoadoutUpgrade[]
  ammo: LoadoutAmmo[]
  crew: LoadoutCrew[]
}

type MemberShip = {
  id: string
  nickname: string | null
  ship: {
    name: string; shipClass: string; rate: number; weaponClass: string | null
    broadsideSlots: number; crewCapacity: number | null; role: string | null
    speed: number | null; maneuverability: number | null; hp: number | null
    holdCapacity: number | null; sternSlots: number | null; bowSlots: number | null
    mortarSlots: number | null
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

export default function RosterClient({ members, currentUserId }: { members: Member[]; currentUserId: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fleet, setFleet] = useState<MemberShip[]>([])
  const [isPending, startTransition] = useTransition()

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
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.color}`}>
                          {rc.emoji} {rc.label}
                        </span>
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
                          const portWeapons = loadout?.weapons.filter(w => w.position === 'port') || []
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

                              {/* Ship Stats */}
                              <div className="grid grid-cols-4 gap-1 text-xs">
                                <div className="text-center">
                                  <span className="text-foreground-secondary block">SPD</span>
                                  <span className="text-foreground font-medium">{s.ship.speed ?? '—'}</span>
                                </div>
                                <div className="text-center">
                                  <span className="text-foreground-secondary block">MAN</span>
                                  <span className="text-foreground font-medium">{s.ship.maneuverability ?? '—'}</span>
                                </div>
                                <div className="text-center">
                                  <span className="text-foreground-secondary block">DUR</span>
                                  <span className="text-foreground font-medium">{s.ship.hp ?? '—'}</span>
                                </div>
                                <div className="text-center">
                                  <span className="text-foreground-secondary block">HOLD</span>
                                  <span className="text-foreground font-medium">{s.ship.holdCapacity ?? '—'}</span>
                                </div>
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
                                    <p>⚔️ Broadside: {portWeapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}</p>
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
                                  {!portWeapons.length && !sternWeapons.length && !bowWeapons.length && !loadout.upgrades.length && !basicCrew.length && (
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
