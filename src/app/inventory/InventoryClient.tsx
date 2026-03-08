'use client'

import { useState, useTransition } from 'react'
import { updateResource, updateConsumable, updateCurrency, updateAmmo, toggleItemVisibility } from '@/app/actions/inventory'

type Resource = { id: string; name: string; type: string }
type Consumable = { id: string; name: string; category: string | null; effect: string | null }
type Currency = { id: string; name: string }
type AmmoType = { id: string; name: string; description: string | null; effect: string | null }

type UserResource = { id: string; resourceId: string; quantity: number; isPublic: boolean; resource: Resource }
type UserConsumable = { id: string; consumableId: string; quantity: number; isPublic: boolean; consumable: Consumable }
type UserCurrency = { id: string; currencyId: string; amount: number; isPublic: boolean; currency: Currency }
type UserAmmo = { id: string; ammoTypeId: string; quantity: number; isPublic: boolean; ammoType: AmmoType }

interface Props {
  inventory: {
    resources: UserResource[]
    consumables: UserConsumable[]
    currencies: UserCurrency[]
    ammo: UserAmmo[]
  }
  catalogs: {
    resources: Resource[]
    consumables: Consumable[]
    currencies: Currency[]
    ammo: AmmoType[]
  }
}

type Tab = 'resources' | 'consumables' | 'currencies' | 'ammo'

export default function InventoryClient({ inventory, catalogs }: Props) {
  const [tab, setTab] = useState<Tab>('resources')
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'resources', label: '⛏️ Resources', count: inventory.resources.filter(r => r.quantity > 0).length },
    { key: 'consumables', label: '🧪 Consumables', count: inventory.consumables.filter(c => c.quantity > 0).length },
    { key: 'ammo', label: '💣 Ammo', count: inventory.ammo.filter(a => a.quantity > 0).length },
    { key: 'currencies', label: '💰 Currencies', count: inventory.currencies.filter(c => c.amount > 0).length },
  ]

  function handleSave(type: Tab, catalogId: string) {
    const val = type === 'currencies' ? parseFloat(editValue) || 0 : parseInt(editValue) || 0
    startTransition(async () => {
      if (type === 'resources') await updateResource(catalogId, val)
      else if (type === 'consumables') await updateConsumable(catalogId, val)
      else if (type === 'ammo') await updateAmmo(catalogId, val)
      else await updateCurrency(catalogId, val)
      setEditingId(null)
    })
  }

  // Group resources by type
  const rawResources = inventory.resources.filter(r => r.resource.type === 'Raw')
  const processedResources = inventory.resources.filter(r => r.resource.type === 'Processed')
  const tradeGoods = inventory.resources.filter(r => r.resource.type === 'Trade Good')
  const specialItems = inventory.resources.filter(r => r.resource.type === 'Special')

  // Group consumables by category
  const consumableCategories = [...new Set(inventory.consumables.map(c => c.consumable.category || 'General'))].sort()

  // Summary stats
  const resourceTotal = inventory.resources.reduce((s, r) => s + r.quantity, 0)
  const consumableTotal = inventory.consumables.reduce((s, c) => s + c.quantity, 0)
  const ammoTotal = inventory.ammo.reduce((s, a) => s + a.quantity, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">📦 Resource Inventory</h1>
      <p className="text-foreground-secondary text-sm mb-8">Track your in-game resources, consumables, ammo, and currencies. Click any quantity to edit.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-surface-border pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-surface border border-surface-border border-b-transparent text-foreground' : 'text-foreground-secondary hover:text-foreground'}`}
          >
            {t.label} <span className="text-accent">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Resources Tab */}
      {tab === 'resources' && (
        <div className="space-y-6">
          <p className="text-sm text-foreground-secondary">Total items: <span className="text-accent font-medium">{resourceTotal.toLocaleString()}</span></p>
          <ItemGroup title="⛏️ Raw Resources">
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
                onSave={() => handleSave('resources', r.resourceId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
              />
            ))}
          </ItemGroup>
          <ItemGroup title="🔧 Processed Resources">
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
                onSave={() => handleSave('resources', r.resourceId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
              />
            ))}
          </ItemGroup>
          <ItemGroup title="🏪 Trade Goods">
            {tradeGoods.map(r => (
              <ItemCard
                key={r.id}
                name={r.resource.name}
                value={r.quantity}
                isPublic={r.isPublic}
                isEditing={editingId === r.id}
                editValue={editValue}
                onStartEdit={() => { setEditingId(r.id); setEditValue(String(r.quantity)) }}
                onChangeEdit={setEditValue}
                onSave={() => handleSave('resources', r.resourceId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
              />
            ))}
          </ItemGroup>
          <ItemGroup title="⭐ Special Items">
            {specialItems.map(r => (
              <ItemCard
                key={r.id}
                name={r.resource.name}
                value={r.quantity}
                isPublic={r.isPublic}
                isEditing={editingId === r.id}
                editValue={editValue}
                onStartEdit={() => { setEditingId(r.id); setEditValue(String(r.quantity)) }}
                onChangeEdit={setEditValue}
                onSave={() => handleSave('resources', r.resourceId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('resource', r.id))}
              />
            ))}
          </ItemGroup>
        </div>
      )}

      {/* Consumables Tab */}
      {tab === 'consumables' && (
        <div className="space-y-6">
          <p className="text-sm text-foreground-secondary">Total items: <span className="text-accent font-medium">{consumableTotal.toLocaleString()}</span></p>
          {consumableCategories.map(cat => {
            const items = inventory.consumables.filter(c => (c.consumable.category || 'General') === cat)
            if (items.length === 0) return null
            const catIcons: Record<string, string> = { repair: '🔨', group: '📡', general: '⚙️', powder: '💥', General: '📦' }
            return (
              <ItemGroup key={cat} title={`${catIcons[cat] || '📦'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}>
                {items.map(c => (
                  <ItemCard
                    key={c.id}
                    name={c.consumable.name}
                    subtitle={c.consumable.effect || undefined}
                    value={c.quantity}
                    isPublic={c.isPublic}
                    isEditing={editingId === c.id}
                    editValue={editValue}
                    onStartEdit={() => { setEditingId(c.id); setEditValue(String(c.quantity)) }}
                    onChangeEdit={setEditValue}
                    onSave={() => handleSave('consumables', c.consumableId)}
                    onCancel={() => setEditingId(null)}
                    onToggleVisibility={() => startTransition(() => toggleItemVisibility('consumable', c.id))}
                  />
                ))}
              </ItemGroup>
            )
          })}
        </div>
      )}

      {/* Ammo Tab */}
      {tab === 'ammo' && (
        <div className="space-y-6">
          <p className="text-sm text-foreground-secondary">Total rounds: <span className="text-accent font-medium">{ammoTotal.toLocaleString()}</span></p>
          <ItemGroup title="💣 Ammunition">
            {inventory.ammo.map(a => (
              <ItemCard
                key={a.id}
                name={a.ammoType.name}
                subtitle={a.ammoType.effect || a.ammoType.description || undefined}
                value={a.quantity}
                isPublic={a.isPublic}
                isEditing={editingId === a.id}
                editValue={editValue}
                onStartEdit={() => { setEditingId(a.id); setEditValue(String(a.quantity)) }}
                onChangeEdit={setEditValue}
                onSave={() => handleSave('ammo', a.ammoTypeId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('ammo', a.id))}
              />
            ))}
          </ItemGroup>
        </div>
      )}

      {/* Currencies Tab */}
      {tab === 'currencies' && (
        <div className="space-y-6">
          <ItemGroup title="💰 Currencies">
            {inventory.currencies.map(c => (
              <ItemCard
                key={c.id}
                name={c.currency.name}
                value={c.amount}
                isPublic={c.isPublic}
                isEditing={editingId === c.id}
                editValue={editValue}
                onStartEdit={() => { setEditingId(c.id); setEditValue(String(c.amount)) }}
                onChangeEdit={setEditValue}
                onSave={() => handleSave('currencies', c.currencyId)}
                onCancel={() => setEditingId(null)}
                onToggleVisibility={() => startTransition(() => toggleItemVisibility('currency', c.id))}
              />
            ))}
          </ItemGroup>
        </div>
      )}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm text-foreground-secondary shadow-lg">
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
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
    </div>
  )
}

function ItemCard({
  name, subtitle, value, isPublic, isEditing, editValue, onStartEdit, onChangeEdit, onSave, onCancel, onToggleVisibility,
}: {
  name: string; subtitle?: string; value: number; isPublic: boolean
  isEditing: boolean; editValue: string
  onStartEdit: () => void; onChangeEdit: (v: string) => void; onSave: () => void; onCancel: () => void
  onToggleVisibility: () => void
}) {
  const isEmpty = value === 0
  return (
    <div className={`bg-surface border border-surface-border rounded-lg p-3 transition-opacity ${isEmpty ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-1">
        <span className="text-foreground font-medium text-sm leading-tight">{name}</span>
        <button onClick={onToggleVisibility} className="text-xs text-foreground-secondary hover:text-foreground ml-1 shrink-0">
          {isPublic ? '👁' : '🔒'}
        </button>
      </div>
      {subtitle && <p className="text-xs text-foreground-secondary/70 mb-2 leading-snug">{subtitle}</p>}
      {isEditing ? (
        <div className="flex gap-1">
          <input
            type="number"
            value={editValue}
            onChange={(e) => onChangeEdit(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
            autoFocus
            className="flex-1 bg-surface border border-accent rounded px-2 py-1 text-foreground text-sm focus:outline-none min-w-0"
          />
          <button onClick={onSave} className="text-accent text-sm font-medium">✓</button>
          <button onClick={onCancel} className="text-foreground-secondary text-sm">✕</button>
        </div>
      ) : (
        <div
          className={`text-xl font-bold cursor-pointer hover:text-accent transition-colors ${isEmpty ? 'text-foreground-secondary' : 'text-foreground'}`}
          onClick={onStartEdit}
        >
          {typeof value === 'number' && !Number.isInteger(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toLocaleString()}
        </div>
      )}
    </div>
  )
}
