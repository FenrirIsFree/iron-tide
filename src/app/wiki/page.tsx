import Link from 'next/link'
import WikiHubClient from './WikiHubClient'
import WikiLink from '@/components/wiki/WikiLink'

const sections = [
  {
    heading: '⚓ Ships & Combat',
    items: [
      {
        title: '🚢 Ships',
        desc: 'Browse all ships — stats, classes, factions, weapon slots, and crafting costs.',
        href: '/wiki/ships',
        count: '62 ships',
        category: 'Ships & Combat',
        keywords: ['battleship', 'destroyer', 'mortar', 'heavy', 'transport', 'rate', 'class tree'],
      },
      {
        title: '🔫 Weapons',
        desc: 'Cannons, mortars, and special weapons — damage, range, reload, and crafting info.',
        href: '/wiki/weapons',
        count: '42 weapons',
        category: 'Ships & Combat',
        keywords: ['cannon', 'carronade', 'mortar', 'damage', 'range', 'dps'],
      },
      {
        title: '💣 Ammunition',
        desc: 'All ammo types — hull damage, sail damage, crew damage, and special effects.',
        href: '/wiki/ammo',
        count: '13 types',
        category: 'Ships & Combat',
        keywords: ['ball', 'chain', 'grape', 'explosive', 'fire', 'heated'],
      },
      {
        title: '👥 Crew & Units',
        desc: 'Sailors, boarding units, and special crew — stats, abilities, and faction availability.',
        href: '/wiki/crew',
        count: '55 crew',
        category: 'Ships & Combat',
        keywords: ['sailor', 'boarding', 'marines', 'special'],
      },
      {
        title: '🛠️ Ship Upgrades',
        desc: 'Combat, speed, protection, and utility upgrades — effects, costs, and ranked values.',
        href: '/wiki/upgrades',
        count: '40 upgrades',
        category: 'Ships & Combat',
        keywords: ['hull', 'rigging', 'copper', 'armor', 'repair'],
      },
      {
        title: '⚔️ Combat Guide',
        desc: 'Damage formulas, armor angles, cannons, mortars, boarding, ramming, weather — from decompiled code.',
        href: '/wiki/combat',
        count: '11 sections',
        category: 'Ships & Combat',
        keywords: ['damage formula', 'armor angle', 'boarding', 'ramming', 'pvp', 'weather', 'fire'],
      },
    ],
  },
  {
    heading: '🗺️ Progression & Economy',
    items: [
      {
        title: '⭐ Ranks',
        desc: 'Rank progression from 1 to 30 — XP requirements and Legend skill unlock.',
        href: '/wiki/ranks',
        count: '30 ranks',
        category: 'Progression',
        keywords: ['xp', 'experience', 'level', 'legend', 'promotion'],
      },
      {
        title: '🧭 Captain Skills',
        desc: 'Craft, Exploration, Battle, and Legend skill trees — costs, effects, and requirements.',
        href: '/wiki/skills',
        count: '55 skills',
        category: 'Progression',
        keywords: ['skill tree', 'craft', 'exploration', 'battle', 'legend', 'skill point'],
      },
      {
        title: '🔨 Crafting',
        desc: 'Recipes, workshop blueprints, furnace smelting, and factory production.',
        href: '/wiki/crafting',
        count: '47+ recipes',
        category: 'Progression',
        keywords: ['recipe', 'workshop', 'furnace', 'factory', 'blueprint', 'resources'],
      },
      {
        title: '🎁 Chests & Loot',
        desc: 'Complete loot tables for every chest — drop rates, ship chances, and reward breakdowns.',
        href: '/wiki/chests',
        count: '4 chest types',
        category: 'Progression',
        keywords: ['loot', 'drop rate', 'chest', 'reward', 'imperial', 'inca'],
      },
      {
        title: '🧪 Consumables',
        desc: 'Repair kits, speed boosts, combat buffs, and squadron support items.',
        href: '/wiki/consumables',
        count: '33 items',
        category: 'Progression',
        keywords: ['repair kit', 'speed boost', 'buff', 'squadron'],
      },
    ],
  },
  {
    heading: '🌍 World & Economy',
    items: [
      {
        title: '⚓ Ports',
        desc: 'Cities, bays, and pirate havens — ship building, resources, and port features.',
        href: '/wiki/ports',
        count: '42 ports',
        category: 'World',
        keywords: ['port', 'city', 'bay', 'haven', 'faction', 'building'],
      },
      {
        title: '💰 Trading',
        desc: 'Trade goods, price ranges, margins, tax rates, and profit efficiency rankings.',
        href: '/wiki/trading',
        count: '20 goods',
        category: 'World',
        keywords: ['trade', 'profit', 'tax', 'margin', 'price', 'gold'],
      },
      {
        title: '💎 Resources',
        desc: 'All materials, trade goods, currencies, and special items — values and weights.',
        href: '/wiki/resources',
        count: '68 resources',
        category: 'World',
        keywords: ['material', 'wood', 'iron', 'hemp', 'currency', 'gold', 'silver'],
      },
    ],
  },
  {
    heading: '📖 Game Systems',
    items: [
      {
        title: '💀 NPCs & Bosses',
        desc: 'Enemy types, named bosses, loot tables, and capture mechanics.',
        href: '/wiki/npcs',
        count: '14 bosses',
        category: 'Game Systems',
        keywords: ['npc', 'boss', 'enemy', 'pirate', 'patrol', 'bounty'],
      },
      {
        title: '🏆 Achievements',
        desc: 'Battle, Arena, Top, and Other — earn marks and prove your skill.',
        href: '/wiki/achievements',
        count: '57 achievements',
        category: 'Game Systems',
        keywords: ['achievement', 'mark', 'reward', 'challenge', 'battle', 'arena'],
      },
      {
        title: '⚔️ PvE Missions',
        desc: 'Battle NPC waves — wave compositions, rewards, ship requirements.',
        href: '/wiki/missions',
        count: '12 missions',
        category: 'Game Systems',
        keywords: ['mission', 'pve', 'wave', 'scroll', 'reward'],
      },
      {
        title: '🎨 Cosmetics',
        desc: 'Ship customization — flags, sails, figureheads, decals, and full ship designs.',
        href: '/wiki/cosmetics',
        count: '562 items',
        category: 'Game Systems',
        keywords: ['cosmetic', 'flag', 'sail', 'figurehead', 'decal', 'skin'],
      },
      {
        title: '🏟️ Arena',
        desc: 'PvP arena mode — random upgrades, ranked seasons, and exclusive rewards.',
        href: '/wiki/arena',
        count: '16 maps',
        category: 'Game Systems',
        keywords: ['arena', 'pvp', 'ranked', 'season', 'upgrade'],
      },
      {
        title: '⚜️ Guilds',
        desc: 'Guild system — creation, economy, alliances, faction competition, and titles.',
        href: '/wiki/guilds',
        count: '13 systems',
        category: 'Game Systems',
        keywords: ['guild', 'alliance', 'faction', 'title', 'economy'],
      },
      {
        title: '⚙️ Raw Mechanics',
        desc: 'Technical reference — all game systems data in browsable format.',
        href: '/wiki/mechanics',
        count: '18 systems',
        category: 'Game Systems',
        keywords: ['mechanics', 'formula', 'system', 'technical', 'speed', 'reload'],
      },
    ],
  },
]

// Aggregate counts for stats bar
const TOTAL_PAGES = sections.reduce((acc, s) => acc + s.items.length, 0)
const TOTAL_ITEMS = 62 + 42 + 13 + 55 + 40 + 30 + 55 + 68 + 42 + 14 + 57 + 562 + 16

export const metadata = {
  title: 'Wiki — The Iron Tide',
  description: 'World of Sea Battle game wiki — ships, weapons, ammo, crew, skills, ranks, crafting, and game mechanics. Sourced from decompiled game data.',
}

export default function WikiPage() {
  return (
    <div className="pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">📖 Game Wiki</h1>
        <p className="text-foreground-secondary mt-2 text-sm">
          Comprehensive World of Sea Battle reference — sourced from decompiled game data and network analysis.
        </p>
      </div>

      {/* New to WoSB callout */}
      <div className="mb-8 bg-accent/10 border border-accent/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm mb-1">🚀 New to World of Sea Battle?</p>
          <p className="text-foreground-secondary text-sm">
            Start with the beginner guide — learn your first ship, basic combat, and how to earn gold.
          </p>
        </div>
        <Link
          href="/wiki/getting-started"
          className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-background bg-accent rounded-lg hover:bg-accent-hover transition-colors whitespace-nowrap"
        >
          Getting Started →
        </Link>
      </div>

      {/* Main article cross-references */}
      <div className="mb-8 text-sm text-foreground-secondary space-y-2 border-l-2 border-surface-border pl-4">
        <p>
          For a complete catalog of all playable vessels, see{' '}
          <WikiLink href="/wiki/ships">Ships</WikiLink>. Ship performance depends on your choice of{' '}
          <WikiLink href="/wiki/weapons">Weapons</WikiLink>,{' '}
          <WikiLink href="/wiki/upgrades">Upgrades</WikiLink>, and{' '}
          <WikiLink href="/wiki/crew">Crew</WikiLink>.
        </p>
        <p>
          Progression is tracked through <WikiLink href="/wiki/ranks">Ranks</WikiLink> (1–30) and{' '}
          <WikiLink href="/wiki/skills">Captain Skills</WikiLink> across four trees.{' '}
          <WikiLink href="/wiki/crafting">Crafting</WikiLink> uses{' '}
          <WikiLink href="/wiki/resources">Resources</WikiLink> gathered from combat and{' '}
          <WikiLink href="/wiki/trading">Trading</WikiLink>.
        </p>
        <p>
          For technical system data extracted from game source code, see{' '}
          <WikiLink href="/wiki/combat">Combat Guide</WikiLink> and{' '}
          <WikiLink href="/wiki/mechanics">Raw Mechanics</WikiLink>.
        </p>
      </div>

      <WikiHubClient sections={sections} totalPages={TOTAL_PAGES} totalItems={TOTAL_ITEMS} />
    </div>
  )
}
