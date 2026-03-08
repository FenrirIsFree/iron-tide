'use client'

import { useState } from 'react'

const SECTION_ICONS: Record<string, string> = {
  speedSystem: '⛵',
  cruiseSpeed: '🚀',
  holdCapacity: '📦',
  sailDamage: '🏴',
  windEffects: '💨',
  paddlesAndSteam: '🔧',
  cannonSpeedFactor: '🔫',
  combat: '⚔️',
  boarding: '🏴‍☠️',
  crewSystem: '👥',
  repairSystem: '🔧',
  shallowWater: '🏝️',
  flooding: '🌊',
  destructionTilt: '↗️',
  visibility: '👁️',
  economyEffects: '💰',
  specialAbilities: '✨',
  npcSystem: '💀',
}

const SECTION_LABELS: Record<string, string> = {
  speedSystem: 'Speed System',
  cruiseSpeed: 'Cruise Speed',
  holdCapacity: 'Hold Capacity',
  sailDamage: 'Sail Damage',
  windEffects: 'Wind Effects',
  paddlesAndSteam: 'Paddles & Steam',
  cannonSpeedFactor: 'Cannon Speed Factor',
  combat: 'Combat',
  boarding: 'Boarding',
  crewSystem: 'Crew System',
  repairSystem: 'Repair System',
  shallowWater: 'Shallow Water',
  flooding: 'Flooding',
  destructionTilt: 'Destruction Tilt',
  visibility: 'Visibility',
  economyEffects: 'Economy Effects',
  specialAbilities: 'Special Abilities',
  npcSystem: 'NPC System',
}

function renderValue(value: unknown, depth = 0): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-foreground-muted">—</span>

  if (typeof value === 'boolean') {
    return <span className={value ? 'text-green-400' : 'text-red-400'}>{value ? 'Yes' : 'No'}</span>
  }

  if (typeof value === 'number') {
    return <span className="text-accent">{value}</span>
  }

  if (typeof value === 'string') {
    // Check if it looks like a formula
    if (value.includes('*') || value.includes('/') || value.includes('Math.') || value.includes('(')) {
      return <code className="bg-surface-hover text-cyan-400 px-1.5 py-0.5 rounded text-xs font-mono">{value}</code>
    }
    return <span className="text-foreground-secondary">{value}</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-foreground-muted">[]</span>
    if (typeof value[0] !== 'object') {
      return <span className="text-foreground-secondary">{value.join(', ')}</span>
    }
    return (
      <div className="space-y-2 mt-1">
        {value.map((item, i) => (
          <div key={i} className="bg-surface-hover rounded p-2 text-sm">
            {typeof item === 'object' && item !== null
              ? Object.entries(item).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-foreground-muted text-xs">{formatKey(k)}</span>
                    <span>{renderValue(v, depth + 1)}</span>
                  </div>
                ))
              : renderValue(item, depth + 1)
            }
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div className={`space-y-1 ${depth > 0 ? 'ml-2 mt-1' : ''}`}>
        {entries.map(([k, v]) => (
          <div key={k} className={`${typeof v === 'object' && v !== null ? '' : 'flex justify-between'} py-0.5`}>
            <span className="text-foreground-muted text-xs">{formatKey(k)}</span>
            {typeof v === 'object' && v !== null ? (
              <div className="ml-3 mt-1">{renderValue(v, depth + 1)}</div>
            ) : (
              <span className="text-sm">{renderValue(v, depth + 1)}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return <span>{String(value)}</span>
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

export default function MechanicsContent({ mechanics }: { mechanics: Record<string, unknown> }) {
  const sections = Object.keys(mechanics).filter(k => k !== 'meta')
  const [activeSection, setActiveSection] = useState(sections[0] || '')

  const data = mechanics[activeSection]

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <nav className="md:w-56 shrink-0">
        <div className="flex flex-wrap md:flex-col gap-1">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeSection === section
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
              }`}
            >
              {SECTION_ICONS[section] ?? '📄'} {SECTION_LABELS[section] ?? formatKey(section)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {SECTION_ICONS[activeSection] ?? '📄'} {SECTION_LABELS[activeSection] ?? formatKey(activeSection)}
        </h2>

        {data && typeof data === 'object' && !Array.isArray(data) ? (
          <div className="space-y-4">
            {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
              <div key={key} className="bg-surface border border-surface-border rounded-xl p-4">
                <h3 className="text-foreground font-semibold mb-2">{formatKey(key)}</h3>
                <div className="text-sm">{renderValue(value)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            {renderValue(data)}
          </div>
        )}
      </div>
    </div>
  )
}
