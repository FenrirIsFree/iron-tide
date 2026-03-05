'use client'

import { useState, useTransition } from 'react'
import { updateResource, updateConsumable, updateCurrency, toggleItemVisibility } from '@/app/actions/inventory'

type Resource = { id: string; name: string; type: string }
type Consumable = { id: string; name: string; category: string | null }
type Currency = { id: string; name: string }

type UserResource = { id: string; resourceId: string; quantity: number; isPublic: boolean; resource: Resource }
type UserConsumable = { id: string; consumableId: string; quantity: number; isPublic: boolean; consumable: Consumable }
type UserCurrency = { id: string; currencyId: string; amount: number; isPublic: boolean; currency: Currency }

interface Props {
  inventory: {
    resources: UserResource[]
    consumables: UserConsumable[]
    currencies: UserCurrency[]
  }
  catalogs: {
    resources: Resource[]
    consumables: Consumable[]
    currencies: Currency[]
  }
}

export default function InventoryClient({ inventory, catalogs }: Props) {
  const [tab, setTab] = useState<'resources' | 'consumables' | 'currencies'>('resources')
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const tabs = [
    { key: 'resources' as const, label: '⛏️ Resources', count: inventory.resources.length },
    { key: 'consumables' as const, label: '🧪 Consumables', count: inventory.consumables.length },
    { key: 'currencies' as const, label: '💰 Currencies', count: inventory.currencies.length },
  ]

  const hasAny = inventory.resources.length > 0 || inventory.consumables.length > 0 || inventory.currencies.length > 0

  function handleSaveResource(resourceId: string) {
    const val = parseInt(editValue) || 0
    startTransition(async () => {
      await updateResource(resourceId, val)
      setEditingId(null)
    })
  }

  function handleSaveConsumable(consumableId: string) {
    const val = parseInt(editValue) || 0
    startTransition(async () => {
      await updateConsumable(consumableId, val)
      setEditingId(null)
    })
  }

  function handleSaveCurrency(currencyId: string) {
    const val = parseFloat(editValue) || 0
    startTransition(async () => {
      await updateCurrency(currencyId, val)
      setEditingId(null)
    })
  }

  function handleAddFromCatalog(type: 'resource' | 'consumable' | 'currency', id: string) {
    startTransition(async () => {
      if (type === 'resource') await updateResource(id, 0)
      else if (type === 'consumable') await updateConsumable(id, 0)
      else await updateCurrency(id, 0)
    })
  }

  // Group resources by type
  const rawResources = inventory.resources.filter(r => r.resource.type === 'Raw')
  const processedResources = inventory.resources.filter(r => r.resource.type === 'Processed')

  // Group consumables by category
  const groupedConsumables: Record<string, UserConsumable[]> = {}
  inventory.consumables.forEach(c => {
    const cat = c.consumable.category || 'General'
    if (!groupedConsumables[cat]) groupedConsumables[cat] = []
    groupedConsumables[cat].push(c)
  })

  // Untracked items
  const trackedResourceIds = new Set(inventory.resources.map(r => r.resourceId))
  const untrackedResources = catalogs.resources.filter(r => !trackedResourceIds.has(r.id))
  const trackedConsumableIds = new Set(inventory.consumables.map(c => c.consumableId))
  const untrackedConsumables = catalogs.consumables.filter(c => !trackedConsumableIds.has(c.id))
  const trackedCurrencyIds = new Set(inventory.currencies.map(c => c.currencyId))
  const untrackedCurrencies = catalogs.currencies.filter(c => !trackedCurrencyIds.has(c.id))

  const resourceTotal = inventory.resources.reduce((s, r) => s + r.quantity, 0)
  const consumableTotal = inventory.consumables.reduce((s, c) => s + c.quantity, 0)
  const currencyItems = inventory.currencies

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">📦 Resource Inventory</h1>

      {!hasAny && (
        <div className="text-center py-20">
          <p className="text-foreground-secondary text-lg mb-4">Start tracking your inventory</p>
          <p className="text-foreground-secondary text-sm">Select a tab below and add items from the catalog.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-surface-border pb-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${tab === t.key ? 'bg-surface border border-surface-border border-b-transparent text-foreground' : 'text-foreground-secondary hover:text-foreground'}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Resources Tab */}
      {tab === 'resources' && (
        <div className="space-y-6">
          <p className="text-sm text-foreground-secondary">Total: <span className="text-accent font-medium">{resourceTotal}</span></p>
          {rawResources.length > 0 && (
            <ItemGroup title="Raw Resources">
              {rawResources.map(r => (
                <ItemCard
                  key={r.id}
                  name={r.resource.name}
                  value={r.quantity}
                  isPublic={r.isPublic}
                  isEditing={editingId === r.id}
                  editValue={editValue}
                  onStartEdit={() => { setEditingId(r.id); setEditValue(String(r.quantity)) }}
                  onChangeEdit={setEditValue}
                  onSave={() => handleSaveResource(r.resourceId)}
                  onCancel={() => setEditingId(null)}
                  onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
                />
              ))}
            </ItemGroup>
          )}
          {processedResources.length > 0 && (
            <ItemGroup title="Processed Resources">
              {processedResources.map(r => (
                <ItemCard
                  key={r.id}
                  name={r.resource.name}
                  value={r.quantity}
                  isPublic={r.isPublic}
                  isEditing={editingId === r.id}
                  editValue={editValue}
                  onStartEdit={() => { setEditingId(r.id); setEditValue(String(r.quantity)) }}
                  onChangeEdit={setEditValue}
                  onSave={() => handleSaveResource(r.resourceId)}
                  onCancel={() => setEditingId(null)}
                  onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
                />
              ))}
            </ItemGroup>
          )}
          {untrackedResources.length > 0 && (
            <AddFromCatalog
              title="Add resources to track"
              items={untrackedResources}
              onAdd={(id) => handleAddFromCatalog('resource', id)}
            />
          )}
        </div>
      )}

      {/* Consumables Tab */}
      {tab === 'consumables' && (
        <div className="space-y-6">
          <p className="text-sm text-foreground-secondary">Total: <span className="text-accent font-medium">{consumableTotal}</span></p>
          {Object.entries(groupedConsumables).map(([cat, items]) => (
            <ItemGroup key={cat} title={cat}>
              {items.map(c => (
                <ItemCard
                  key={c.id}
                  name={c.consumable.name}
                  value={c.quantity}
                  isPublic={c.isPublic}
                  isEditing={editingId === c.id}
                  editValue={editValue}
                  onStartEdit={() => { setEditingId(c.id); setEditValue(String(c.quantity)) }}
                  onChangeEdit={setEditValue}
                  onSave={() => handleSaveConsumable(c.consumableId)}
                  onCancel={() => setEditingId(null)}
                  onToggleVisibility={() => startTransition(() => toggleItemVisibility('consumable', c.id))}
                />
              ))}
            </ItemGroup>
          ))}
          {untrackedConsumables.length > 0 && (
            <AddFromCatalog
              title="Add consumables to track"
              items={untrackedConsumables}
              onAdd={(id) => handleAddFromCatalog('consumable', id)}
            />
          )}
        </div>
      )}

      {/* Currencies Tab */}
      {tab === 'currencies' && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currencyItems.map(c => (
              <ItemCard
                key={c.id}
                name={c.currency.name}
                value={c.amount}
                isPublic={c.isPublic}
                isEditing={editingId === c.id}
                editValue={editValue}
                onStartEdit={() => { setEditingId(c.id); setEditValue(String(c.amount)) }}
                onChangeEdit={setEditValue}
                onSave={() => handleSaveCurrency(c.currencyId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('currency', c.id))}
              />
            ))}
          </div>
          {untrackedCurrencies.length > 0 && (
            <AddFromCatalog
              title="Add currencies to track"
              items={untrackedCurrencies}
              onAdd={(id) => handleAddFromCatalog('currency', id)}
            />
          )}
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm text-foreground-secondary">
          Updating…
        </div>
      )}
    </div>
  )
}

function ItemGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-accent mb-3">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  )
}

function ItemCard({
  name, value, isPublic, isEditing, editValue, onStartEdit, onChangeEdit, onSave, onCancel, onToggleVisibility,
}: {
  name: string; value: number; isPublic: boolean
  isEditing: boolean; editValue: string
  onStartEdit: () => void; onChangeEdit: (v: string) => void; onSave: () => void; onCancel: () => void
  onToggleVisibility: () => void
}) {
  return (
    <div className="bg-surface border border-surface-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground font-medium text-sm">{name}</span>
        <button onClick={onToggleVisibility} className="text-xs text-foreground-secondary hover:text-foreground">
          {isPublic ? '👁' : '🔒'}
        </button>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={editValue}
            onChange={(e) => onChangeEdit(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
            autoFocus
            className="flex-1 bg-surface border border-accent rounded px-2 py-1 text-foreground text-sm focus:outline-none"
          />
          <button onClick={onSave} className="text-accent text-sm font-medium">✓</button>
          <button onClick={onCancel} className="text-foreground-secondary text-sm">✕</button>
        </div>
      ) : (
        <div className="text-2xl font-bold text-foreground cursor-pointer hover:text-accent transition-colors" onClick={onStartEdit}>
          {typeof value === 'number' && !Number.isInteger(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toLocaleString()}
        </div>
      )}
    </div>
  )
}

function AddFromCatalog({ title, items, onAdd }: { title: string; items: { id: string; name: string }[]; onAdd: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState('')
  return (
    <div className="border border-surface-border border-dashed rounded-lg p-4">
      <p className="text-sm text-foreground-secondary mb-2">{title}</p>
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 bg-surface border border-surface-border rounded-lg px-3 py-2 text-foreground text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Select…</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <button
          onClick={() => { if (selectedId) { onAdd(selectedId); setSelectedId('') } }}
          disabled={!selectedId}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          Track
        </button>
      </div>
    </div>
  )
}
