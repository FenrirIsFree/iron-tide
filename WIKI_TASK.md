# Wiki Task: Individual Ship Detail Pages

## Overview
Create dynamic route `/wiki/ships/[slug]` that renders individual detail pages for each of the 62 ships.

## Technical Requirements

### Next.js 15 App Router Patterns
- `params` is a Promise — must `await` it
- Use `generateStaticParams()` to pre-render all 62 pages
- Use `generateMetadata()` for per-ship SEO
- Server Component page, client component only for interactive parts
- Add `loading.tsx` and `error.tsx`
- Use `notFound()` from `next/navigation` if ship not found

### Files to Create
1. `src/app/wiki/ships/[slug]/page.tsx` — Server Component, loads ship data
2. `src/app/wiki/ships/[slug]/ShipDetail.tsx` — Client Component for interactive stat display
3. `src/app/wiki/ships/[slug]/loading.tsx` — Skeleton loader
4. `src/app/wiki/ships/[slug]/error.tsx` — Error boundary

### Files to Modify
1. `src/lib/gameData.ts` — Add `getShipBySlug(slug)` and `getAllShipSlugs()` functions
2. `src/app/wiki/ships/ShipTable.tsx` — Add link to detail page for each ship name
3. `src/app/wiki/ships/page.tsx` — Fix metadata (says "69 ships", should be dynamic)

### Slug Format
- Lowercase, hyphenated: `12-apostolov`, `black-prince`, `flying-cloud`
- Generate from ship name: `name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')`

### Data Available per Ship (from wiki-ships.json)
```
name, description, health, speed, mobility, armor, capacity, crew, rank,
gameType, displayClass, subtype, coolness, faction, gameFaction,
extraUpgradeSlots, costReal, requiredRank, broadsideArmor, hold,
displacement, integrity, weaponSlots {stern, broadside, bow},
swivelGuns, mortarSlots, specialWeaponSlots, role, inGameClass,
inGameRate, bonuses[], acquisition {type}, craftingCost {resource: amount}
```

### Ship Detail Page Layout

```
[Breadcrumb: Wiki > Ships > Ship Name]

[Ship Name]                              [Faction Badge]
[In-Game Class] • [Display Class] • [Rate in Roman Numerals]
[Description - italic, muted text]

━━━ Core Stats ━━━━━━━━━━━━━━━━━━━━━━━━
| HP          | Speed      | Mobility   |
| Armor       | Hold       | Crew       |
| Displacement| Integrity  | Required Rank |
(Each stat as a card with icon, label, value)

━━━ Weapon Loadout ━━━━━━━━━━━━━━━━━━━━
| Broadside Slots | Stern Slots | Bow Slots |
| Swivel Guns     | Mortar Slots | Special Weapon Slots |
| Extra Upgrade Slots |
(Visual layout showing slot distribution)

━━━ Acquisition ━━━━━━━━━━━━━━━━━━━━━━━
Type: Craftable / Gold Purchase / Chest / Premium
Crafting Cost table (if craftable):
  Resource | Amount
  ---------|-------
  Planks   | 1130
  Iron Bars| 1500
  etc.

━━━ Additional Info ━━━━━━━━━━━━━━━━━━━
- Bonuses (if any)
- Can be NPC: Yes/No
- Coolness tier
```

### Design System (must match existing site)
- Background: `bg-background` (#000000)
- Cards: `bg-surface border border-surface-border rounded-xl`
- Hover: `hover:bg-surface-hover`
- Primary: `text-primary` (Blood Red #B91C1C)
- Accent: `text-accent` (Antique Gold #D4A844)
- Text: `text-foreground` (white), `text-foreground-secondary` (gray)
- Font: Geist Sans (already loaded globally)

### Faction Colors (use for badges/accents)
- Espaniol: warm red/orange
- Antilia: blue
- Kai & Severia: purple/teal
- Empire: dark gold

### Important
- Import WikiBreadcrumb from `@/components/WikiBreadcrumb`
- Import Navbar from `@/components/Navbar`
- Import Footer from `@/components/Footer`
- Use the same page structure as existing wiki pages (see src/app/wiki/weapons/page.tsx for reference)
- ALL data comes from gameData.ts loaders reading game-data/*.json files
- Do NOT use any database queries — this is static JSON data
- The `'use client'` directive MUST be the very first line if used
