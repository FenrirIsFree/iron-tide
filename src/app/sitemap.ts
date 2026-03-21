import type { MetadataRoute } from 'next'
import { getShips } from '@/lib/gameData'

const BASE_URL = 'https://www.theirontide.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const ships = getShips()
  const now = new Date().toISOString()

  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/wiki', priority: 0.9, changeFrequency: 'weekly' as const },
    // Data pages
    { path: '/wiki/ships', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/wiki/ships/classes', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/weapons', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/wiki/ammo', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/crew', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/upgrades', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/ranks', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/skills', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/crafting', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/chests', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/consumables', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/ports', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/trading', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/resources', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/npcs', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/achievements', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/wiki/missions', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/wiki/cosmetics', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/wiki/arena', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/guilds', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/mechanics', priority: 0.5, changeFrequency: 'monthly' as const },
    // Guides
    { path: '/wiki/combat', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/wiki/getting-started', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/wiki/factions', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/economy', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wiki/pvp', priority: 0.7, changeFrequency: 'monthly' as const },
    // Tools
    { path: '/wiki/tools', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/wiki/tools/damage-calculator', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/wiki/tools/ship-compare', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/wiki/tools/crafting-calculator', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/wiki/tools/xp-calculator', priority: 0.7, changeFrequency: 'weekly' as const },
  ]

  const entries: MetadataRoute.Sitemap = staticPages.map(p => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  // Dynamic ship detail pages
  for (const ship of ships) {
    const slug = ship.name.toLowerCase().replace(/ /g, '-')
    entries.push({
      url: `${BASE_URL}/wiki/ships/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return entries
}
