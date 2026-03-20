'use client'

import { useState, useMemo } from 'react'

interface Resource {
  gameId: string
  name: string
  description: string
  mediumCost: number
  mass: number
  effects: string
  icon: string
}

type SortKey = 'name' | 'mediumCost' | 'mass'

export default function ResourcesContent({ resources }: { resources: Resource[] }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let result = resources
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'mediumCost') cmp = a.mediumCost - b.mediumCost
      else if (sortKey === 'mass') cmp = a.mass - b.mass
      return sortAsc ? cmp : -cmp
    })
    return result
  }, [resources, search, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <th
        className="px-4 py-3 text-left cursor-pointer hover:text-accent transition-colors select-none"
        onClick={() => toggleSort(field)}
      >
        {label} {sortKey === field && (sortAsc ? '↑' : '↓')}
      </th>
    )
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search resources..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted w-full max-w-xs"
      />

      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                <SortHeader label="Name" field="name" />
                <SortHeader label="Value" field="mediumCost" />
                <SortHeader label="Weight" field="mass" />
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.gameId} className="border-b border-surface-border hover:bg-surface-hover/50 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-accent font-mono">{r.mediumCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground-secondary font-mono">{r.mass}</td>
                  <td className="px-4 py-3 text-foreground-secondary text-xs max-w-md">
                    {r.description
                      ? r.description.replace(/#/g, '').slice(0, 120) + (r.description.length > 120 ? '…' : '')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-foreground-muted text-xs">
        Value = medium market cost in gold. Weight = cargo space per unit.
      </p>
    </div>
  )
}
