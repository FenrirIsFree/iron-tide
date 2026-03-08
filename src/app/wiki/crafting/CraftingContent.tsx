'use client'

import { useState } from 'react'

interface Recipe {
  name: string
  output: number | string
  ingredients: Record<string, number>
  craftTime: number | null
}

interface CraftingData {
  meta: Record<string, unknown>
  categories: Record<string, Recipe[]>
}

interface WorkshopRecipe {
  hours?: number
  category?: string
  input?: Record<string, number>
  output?: Record<string, number>
  factory?: string
  [key: string]: unknown
}

interface WorkshopData {
  _meta: Record<string, unknown>
  furnaceRecipes: unknown[]
  workshopRecipes: unknown[]
  personalIsleWorkshop: unknown
  bondmanFactory: unknown
  [key: string]: unknown
}

function formatCamelCase(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()
}

const CATEGORY_LABELS: Record<string, string> = {
  processing: '⚙️ Processing',
  ammunition: '💣 Ammunition',
  repairs: '🔧 Repairs',
  consumables: '🧪 Consumables',
  variable: '🎲 Variable Output',
}

export default function CraftingContent({
  crafting,
  workshop,
}: {
  crafting: CraftingData
  workshop: WorkshopData
}) {
  const [activeCategory, setActiveCategory] = useState<string>('processing')
  const [search, setSearch] = useState('')

  const categories = Object.keys(crafting.categories)
  const recipes = crafting.categories[activeCategory] || []

  const filtered = search
    ? recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearch('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-foreground-secondary hover:text-foreground'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat} ({(crafting.categories[cat] || []).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent w-64"
        />
        <span className="text-foreground-muted text-sm self-center">
          {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Recipe cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((recipe, i) => (
          <div
            key={`${recipe.name}-${i}`}
            className="bg-surface border border-surface-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground font-semibold">{recipe.name}</h3>
              <span className="text-accent text-sm font-medium">
                ×{recipe.output}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-foreground-muted text-xs">Ingredients:</span>
              {Object.entries(recipe.ingredients).map(([item, qty]) => (
                <div key={item} className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">{item}</span>
                  <span className="text-foreground">{qty}</span>
                </div>
              ))}
            </div>

            {recipe.craftTime != null && (
              <div className="text-foreground-muted text-xs">
                ⏱️ {recipe.craftTime} min
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workshop section */}
      {workshop.furnaceRecipes && Array.isArray(workshop.furnaceRecipes) && workshop.furnaceRecipes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">🔥 Furnace Recipes</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(workshop.furnaceRecipes as WorkshopRecipe[]).map((r, i) => (
              <div
                key={i}
                className="bg-surface border border-surface-border rounded-xl p-4"
              >
                <h3 className="text-foreground font-semibold mb-2">
                  {r.output ? Object.keys(r.output).map(formatCamelCase).join(', ') : `Recipe ${i + 1}`}
                </h3>
                {r.input && (
                  <div className="space-y-1 mb-2">
                    <span className="text-foreground-muted text-xs">Input:</span>
                    {Object.entries(r.input).map(([item, qty]) => (
                      <div key={item} className="flex justify-between text-sm">
                        <span className="text-foreground-secondary">{formatCamelCase(item)}</span>
                        <span className="text-foreground">{qty}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.output && (
                  <div className="space-y-1 mb-2">
                    <span className="text-foreground-muted text-xs">Output:</span>
                    {Object.entries(r.output).map(([item, qty]) => (
                      <div key={item} className="flex justify-between text-sm">
                        <span className="text-accent">{formatCamelCase(item)}</span>
                        <span className="text-accent font-medium">{qty}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.hours != null && (
                  <div className="text-foreground-muted text-xs">⏱️ {r.hours}h</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {workshop.workshopRecipes && Array.isArray(workshop.workshopRecipes) && workshop.workshopRecipes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">🛠️ Workshop Blueprints</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(workshop.workshopRecipes as WorkshopRecipe[]).map((r, i) => (
              <div
                key={i}
                className="bg-surface border border-surface-border rounded-xl p-4"
              >
                <h3 className="text-foreground font-semibold mb-2">
                  {r.output ? Object.keys(r.output).map(formatCamelCase).join(', ') : `Blueprint ${i + 1}`}
                </h3>
                {r.input && (
                  <div className="space-y-1 mb-2">
                    <span className="text-foreground-muted text-xs">Input:</span>
                    {Object.entries(r.input).map(([item, qty]) => (
                      <div key={item} className="flex justify-between text-sm">
                        <span className="text-foreground-secondary">{formatCamelCase(item)}</span>
                        <span className="text-foreground">{qty}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.output && (
                  <div className="space-y-1 mb-2">
                    <span className="text-foreground-muted text-xs">Output:</span>
                    {Object.entries(r.output).map(([item, qty]) => (
                      <div key={item} className="flex justify-between text-sm">
                        <span className="text-accent">{formatCamelCase(item)}</span>
                        <span className="text-accent font-medium">{qty}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  {r.hours != null && (
                    <span className="text-foreground-muted text-xs">⏱️ {r.hours}h</span>
                  )}
                  {r.factory && (
                    <span className="text-foreground-muted text-xs">🏭 {formatCamelCase(r.factory)}</span>
                  )}
                  {r.category && (
                    <span className="text-foreground-muted text-xs">📁 {formatCamelCase(r.category)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
