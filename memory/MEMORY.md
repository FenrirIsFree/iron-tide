# Iron Tide — Claude Memory

## Project
Next.js 16 (Turbopack) + Tailwind CSS app at /home/node/.openclaw/workspace/projects/iron-tide
Site: theirontide.org — World of Sea Battle guild wiki

## Key paths
- `src/app/` — Next.js App Router pages
- `src/components/` — shared components (Navbar, Footer, WikiBreadcrumb, UserProvider)
- `src/components/wiki/` — wiki-specific components (WikiSidebar, TableOfContents, SeeAlso, NavBox)
- `src/lib/gameData.ts` — game data accessors (do NOT modify)
- `game-data/` — JSON game data files (do NOT modify)

## Color system (globals.css)
Custom CSS vars mapped via @theme inline to Tailwind:
- bg-background (#000), bg-surface (#1C1C1C), bg-surface-hover (#2A2A2A)
- border-surface-border (#333)
- text-foreground (#fff), text-foreground-secondary (#9CA3AF), text-foreground-muted (#6B7280)
- text-accent (#D4A844 gold), bg-primary (#B91C1C red)

## Wiki v2 Layout (branch: wiki-v2-layout)
Phase 1 COMPLETE. Built:
1. `src/components/wiki/WikiSidebar.tsx` — collapsible sidebar, localStorage state, mobile overlay
2. `src/app/wiki/WikiLayoutClient.tsx` — client wrapper for mobile hamburger + sidebar
3. `src/app/wiki/layout.tsx` — Navbar + WikiLayoutClient + Footer wraps all /wiki/* pages
4. `src/components/wiki/TableOfContents.tsx` — IntersectionObserver, auto-generates from h2/h3[id], xl+ only
5. `src/components/wiki/SeeAlso.tsx` — server component, card grid, takes {title, href, description}[]
6. `src/components/wiki/NavBox.tsx` — client component (needs pathname), shows category pages
7. All wiki pages updated: removed Navbar/Footer/outer wrapper, pt-24→pt-8
8. SeeAlso added to: combat, ships, weapons, ammo, crew
9. NavBox added to: combat, ships, weapons, ammo, crew, skills, ranks, ports, trading, arena, guilds
10. `src/app/wiki/page.tsx` — redesigned hub with search (WikiHubClient), "New to WoSB?" callout, stats bar
11. `src/app/wiki/WikiHubClient.tsx` — client search/filter component

## Wiki page pattern (after v2)
All /wiki/* pages are just `<main className="flex-1 pt-8 pb-12 px-4 max-w-Xwl mx-auto w-full">` — no Navbar/Footer (layout handles those).

## Build
`npx next build` — passes clean. All 32 routes including 62 ship detail pages.
Warning about middleware→proxy convention (pre-existing, ignore).
