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

type MemberShip = {
  id: string
  nickname: string | null
  ship: { name: string; shipClass: string; rate: number }
  weapons: { weapon: { name: string }; quantity: number }[]
  upgrades: { upgrade: { name: string } }[]
}

const rankConfig: Record<string, { label: string; emoji: string; color: string }> = {
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
                        {fleet.map((s) => (
                          <div key={s.id} className="bg-background/50 rounded-lg p-3">
                            <h4 className="font-medium text-foreground text-sm">
                              {s.ship.name}
                              {s.nickname && <span className="text-accent ml-1">&ldquo;{s.nickname}&rdquo;</span>}
                            </h4>
                            <p className="text-xs text-foreground-secondary">{s.ship.shipClass} · Rate {s.ship.rate}</p>
                            {s.weapons.length > 0 && (
                              <p className="text-xs text-foreground-secondary mt-1">
                                ⚔️ {s.weapons.map(w => `${w.weapon.name} x${w.quantity}`).join(', ')}
                              </p>
                            )}
                            {s.upgrades.length > 0 && (
                              <p className="text-xs text-foreground-secondary mt-0.5">
                                🛡️ {s.upgrades.map(u => u.upgrade.name).join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
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
