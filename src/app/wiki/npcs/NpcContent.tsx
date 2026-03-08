'use client'

import { useState } from 'react'

interface NpcType {
  typeId: string
  enumValue: number
  displayName: string
  category: string
  description: string
  behavior: Record<string, boolean>
  [key: string]: unknown
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
  cannonClass: string
  specialBalls: number
  visual: string
  spawnRegions: number[]
  fleetsPerRegion: number
  fleetSize: number
  defenseWaves: unknown[]
  [key: string]: unknown
}

interface NpcData {
  npcTypes: NpcType[]
  bosses: Boss[]
  captureSystem: Record<string, unknown>
  [key: string]: unknown
}

const REGION_NAMES: Record<number, string> = {
  1: 'Region 1 (Starter)',
  2: 'Region 2',
  3: 'Region 3',
  4: 'Region 4',
  5: 'Region 5',
  6: 'Region 6 (Deep)',
}

function formatCannonClass(cls: string): string {
  return cls
    .replace('DistanceCannon', 'Long Range Cannon')
    .replace('HeavyCannon', 'Heavy Cannon')
    .replace('LiteCannon', 'Light Cannon')
    .replace('Bombardier', 'Bombardier')
    .replace('Mortar', 'Mortar')
}

function formatVisual(visual: string): string {
  return visual
    .replace('BloodShip', 'Blood Ship (red sails)')
    .replace('ShadowShip', 'Shadow Ship (dark hull)')
    .replace('GhostShip', 'Ghost Ship (spectral)')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

const TIER_COLORS: Record<string, string> = {
  '1-star': 'text-green-400',
  '2-star': 'text-blue-400',
  '3-star': 'text-purple-400',
  '4-star': 'text-orange-400',
  '5-star': 'text-red-400',
  'legendary': 'text-yellow-400',
}

const CATEGORY_COLORS: Record<string, string> = {
  'pirate': 'text-red-400',
  'empire': 'text-blue-400',
  'trader': 'text-green-400',
  'other': 'text-foreground-secondary',
  'boss': 'text-yellow-400',
}

export default function NpcContent({ npcs }: { npcs: NpcData }) {
  const [tab, setTab] = useState<'bosses' | 'types'>('bosses')
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)

  const sortedBosses = [...npcs.bosses].sort((a, b) => b.hp - a.hp)

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
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
          ⚓ NPC Types ({npcs.npcTypes.length})
        </button>
      </div>

      {tab === 'bosses' && (
        <div className="grid gap-4">
          {sortedBosses.map(boss => (
            <div
              key={boss.name}
              className="bg-surface border border-surface-border rounded-xl overflow-hidden"
            >
              <div
                onClick={() => setExpandedBoss(expandedBoss === boss.name ? null : boss.name)}
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-foreground font-semibold text-lg">{boss.name}</h3>
                  <span className={`text-xs font-medium ${TIER_COLORS[boss.tier] ?? 'text-foreground-secondary'}`}>
                    {boss.tier?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-red-400">❤️ {boss.hp.toLocaleString()}</span>
                  <span className="text-foreground-secondary">🚢 {boss.shipName}</span>
                  <span className="text-foreground-muted">{expandedBoss === boss.name ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedBoss === boss.name && (
                <div className="px-4 pb-4 border-t border-surface-border pt-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">HP</span>
                      <span className="text-foreground font-medium">{boss.hp.toLocaleString()}</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Armor</span>
                      <span className="text-foreground font-medium">{boss.armor}</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Speed</span>
                      <span className="text-foreground font-medium">{boss.speed} kn</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Damage/Shot</span>
                      <span className="text-foreground font-medium">{boss.damagePerShot}</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Reload</span>
                      <span className="text-foreground font-medium">{boss.reloadSec}s</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">DPS</span>
                      <span className="text-red-400 font-medium">
                        {boss.reloadSec > 0 ? (boss.damagePerShot / boss.reloadSec).toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Cannon</span>
                      <span className="text-foreground font-medium">{formatCannonClass(boss.cannonClass)}</span>
                    </div>
                    <div className="bg-surface-hover rounded p-2">
                      <span className="text-foreground-muted block text-xs">Special Ammo</span>
                      <span className="text-foreground font-medium">{boss.specialBalls}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                      Hull: {boss.shipName}
                    </span>
                    <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                      Appearance: {formatVisual(boss.visual)}
                    </span>
                    {boss.spawnRegions.length > 0 && (
                      <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                        Spawns in: {boss.spawnRegions.map(r => REGION_NAMES[r] ?? `Region ${r}`).join(', ')}
                      </span>
                    )}
                    <span className="bg-surface-hover text-foreground-secondary text-xs px-2 py-1 rounded">
                      Fleet: {boss.fleetSize} ship{boss.fleetSize > 1 ? 's' : ''} × {boss.fleetsPerRegion}/region
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'types' && (
        <div className="grid gap-3">
          {npcs.npcTypes.map(npc => (
            <div
              key={npc.typeId}
              className="bg-surface border border-surface-border rounded-xl overflow-hidden"
            >
              <div
                onClick={() => setExpandedType(expandedType === npc.typeId ? null : npc.typeId)}
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-foreground font-medium">{npc.displayName}</h3>
                  <span className={`text-xs ${CATEGORY_COLORS[npc.category] ?? 'text-foreground-secondary'}`}>
                    {npc.category}
                  </span>
                </div>
                <span className="text-foreground-muted text-sm">{expandedType === npc.typeId ? '▲' : '▼'}</span>
              </div>

              {expandedType === npc.typeId && (
                <div className="px-4 pb-4 border-t border-surface-border pt-3">
                  <p className="text-foreground-secondary text-sm mb-3">{npc.description}</p>
                  {npc.behavior && (
                    <div className="flex flex-wrap gap-2">
                      {npc.behavior.aggressive && (
                        <span className="bg-red-400/10 text-red-400 text-xs px-2 py-1 rounded">⚔️ Aggressive</span>
                      )}
                      {npc.behavior.canBeCaptured && (
                        <span className="bg-green-400/10 text-green-400 text-xs px-2 py-1 rounded">🏴 Capturable</span>
                      )}
                      {npc.behavior.attacksPlayers && (
                        <span className="bg-orange-400/10 text-orange-400 text-xs px-2 py-1 rounded">🎯 Attacks Players</span>
                      )}
                      {npc.behavior.showOnWorldMap && (
                        <span className="bg-blue-400/10 text-blue-400 text-xs px-2 py-1 rounded">🗺️ On World Map</span>
                      )}
                      {!npc.behavior.aggressive && !npc.behavior.attacksPlayers && (
                        <span className="bg-green-400/10 text-green-400 text-xs px-2 py-1 rounded">🕊️ Peaceful</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
