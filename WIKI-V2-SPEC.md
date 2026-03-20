# Iron Tide Wiki v2 — Project Specification

_Project started: 2026-03-20_
_Inspired by: Minecraft Wiki, EVE University Wiki, Stardew Valley Wiki_
_Goal: Transform the Iron Tide wiki from a data reference into a comprehensive, interconnected knowledge base that players keep open while they play._

---

## Vision

The wiki should feel like **falling down a rabbit hole** — you come to look up one cannon and 20 minutes later you've learned about armor angles, ship class trees, and the best ammo for PvP. Every page connects to related content. Every topic links to the things a player would naturally wonder about next.

---

## Phase 1: Wiki Layout & Navigation

### 1.1 Dedicated Wiki Layout (`/wiki` and all subpages)

**Persistent Sidebar Navigation** (always visible on desktop, hamburger on mobile):
```
📖 WIKI HOME

🚀 Getting Started
   New Player Guide
   Choosing a Faction
   Your First Ship
   Economy Basics

🚢 Ships
   Ship Database (all ships)
   Ship Class Trees
   Ship Comparison Tool
   → Battle Class
   → Heavy Class
   → Transport Class
   → Fast Class
   → Siege Class

⚔️ Combat
   Combat Guide
   Damage Calculator
   Weapons
   Ammo Types
   Powder Kegs

👥 Crew & Skills
   Crew Types
   Captain Skills
   Ranks & Progression

🔧 Equipment
   Ship Upgrades
   Consumables
   Crafting

🌍 World
   Ports
   Resources
   Trading
   Missions (PvE)

🏟️ Competitive
   Arena
   Guilds
   Achievements
   Cosmetics

📊 Game Data
   Formulas & Mechanics
   NPC Guide
   Chests & Loot
```

**Key design patterns from EVE/Minecraft wikis:**
- Sidebar is collapsible sections, current page highlighted
- Breadcrumb trail at top of every page: `Wiki > Ships > Battle Class > Victory`
- "Main article" links from hub pages to detail pages (EVE style)
- Table of contents auto-generated from H2/H3 headings on long pages
- Footer navigation: "← Previous | Category Index | Next →"

### 1.2 Wiki Hub Page Redesign (`/wiki`)

Instead of a flat card grid, model after EVE University's main page:
- **Search bar** prominently at top
- **"New to WoSB?"** callout box linking to Getting Started guide
- **Category sections** with icon + 3-5 key article links each
- **"Popular Pages"** section (most useful pages)
- **Stats bar**: "X articles covering Y game items"

### 1.3 Global Wiki Search

Client-side search that indexes all wiki content:
- Searches page titles, descriptions, and key terms
- Instant results as you type
- Shows category badges on results
- Consider building a search index JSON at build time

---

## Phase 2: Cross-Linking System ("The Rabbit Hole")

This is the single most important change. Every page needs to connect to related content.

### 2.1 "Main Article" Links (EVE University Pattern)

On hub/overview pages, reference detail pages:
```
## Ship Classes

Ships are organized into five combat classes...

📄 **Main article:** [Ship Class Trees →](/wiki/ships/classes)
```

### 2.2 Inline Wiki Links

Within body text, link game terms to their wiki pages:
- "Equip your ship with [Heavy Cannons](/wiki/weapons) and [Chain Shot](/wiki/ammo) for maximum sail damage"
- Every mention of a ship name links to its detail page
- Every mention of a resource links to the resources page
- Every mention of a game mechanic links to the relevant page

### 2.3 "See Also" / "Related Pages" Sections

At the bottom of every page:
```
## 📌 See Also
- [Ammo Types](/wiki/ammo) — damage modifiers for each ammo type
- [Ship Upgrades](/wiki/upgrades) — boost your ship's performance
- [Combat Guide](/wiki/combat) — master the damage formula
- [Crafting](/wiki/crafting) — build weapons and ships
```

### 2.4 Navigation Boxes (Minecraft Pattern)

At the very bottom, a compact nav box showing all pages in the same category:
```
┌──────────────────────────────────────────────┐
│ ⚔️ COMBAT                                    │
│ Combat Guide · Weapons · Ammo · Powder Kegs  │
│ Damage Calculator · Ship Upgrades            │
└──────────────────────────────────────────────┘
```

### 2.5 Contextual Cross-References

On specific data pages:
- **Ship detail page**: "This ship can equip: [list of compatible weapons with links]"
- **Weapon page**: "Ships that can mount this weapon: [links]"
- **Resource page**: "Used in crafting: [list of ships/weapons that need this resource]"
- **Ammo page**: "Best used with: [weapon recommendations]"
- **Crew page**: "Available on: [ship classes that use this crew type]"

---

## Phase 3: Interactive Tools

### 3.1 Damage Calculator (`/wiki/tools/damage-calculator`)

**Inputs:**
- Select weapon (dropdown with all 42 weapons)
- Select ammo type (13 ammo types)
- Target armor value (slider or input, 1-10)
- Impact angle (visual slider: broadside → bow, 0°-90°)
- Distance factor (optional)

**Outputs:**
- Raw damage per shot
- Effective damage after armor
- DPS
- Shots to kill (given target HP, user enters or picks a ship)
- Visual angle indicator showing multiplier
- "Mortar note" — if mortar selected, show that angle is ignored

**Data source:** `wiki-formulas.json` (damageCalculation), `wiki-weapons.json`, `wiki-ammo.json`

### 3.2 Ship Comparison Tool (`/wiki/tools/ship-compare`)

- Pick 2-3 ships from dropdowns
- Side-by-side stat comparison with visual bars
- Highlight which ship wins each stat (green/red)
- Show class, rate, faction, weapon slots
- Link to each ship's detail page

### 3.3 Crafting Calculator (`/wiki/tools/crafting-calculator`)

- Select a ship or weapon to craft
- Shows total resource requirements
- Shows estimated gold cost
- Faction port discount/penalty
- "I have these resources" mode — shows what's still needed

### 3.4 XP Calculator (`/wiki/tools/xp-calculator`)

- Select ship class
- Select current rate → target rate
- Shows total XP needed
- Shows XP per rate step
- Notes on class modifiers (Destroyer discount, Heavy surcharge)
- Upgrade bonus info (install all upgrades = 100% XP gain)

---

## Phase 4: New Content Pages

### 4.1 Getting Started Guide (`/wiki/getting-started`)

**"Your First Hour in World of Sea Battle"**

Sections:
1. What is WoSB? (30-second overview)
2. Choosing Your Faction (Antilia, Kai & Severia, Espaniol, Trade Union — with pros/cons)
3. Your First Ship (Rate VII starter, what to expect)
4. Basic Controls & UI
5. Your First Battle (combat basics, aiming, ammo)
6. Understanding the Ship Tree (how to unlock better ships)
7. Making Money (trading, missions, PvP rewards)
8. Joining a Guild
9. Next Steps (links to deeper wiki content)

Style: Conversational, step-by-step, with callout boxes for tips and warnings.

### 4.2 Ship Class Trees Page (`/wiki/ships/classes`)

Visual tree for each of the 5 classes:
```
BATTLE CLASS ⚔️
Rate VII: Horizont
    ↓
Rate VI: La Salamandre, Shunsen
    ↓
Rate V: Black Prince, Black Wind, Kwee Song
    ↓
Rate IV: Devourer, Essex, Red Arrow
    ↓
Rate III: Anson, Le Saint Louis
    ↓
Rate II: Montanes, Neptuno, Octopus, Sans Pareil
    ↓
Rate I: De Zeven Provincien, Sovereign, Victory
```

Each ship name links to its detail page. XP requirements shown at each tier.
Include the class description from localization files.
Show XP bonus formula for researched branches.

### 4.3 Faction Guide (`/wiki/factions`)

One section per faction with:
- Lore description (from localization)
- Unique ships available
- Crafting port advantages
- Play style summary

### 4.4 Economy Guide (`/wiki/economy`)

- How gold works
- Trading basics (buy low, sell high, tax rates)
- Resource gathering
- Crafting for profit
- Port economy (port levels, bonuses)

### 4.5 PvP Guide (`/wiki/pvp`)

- PvP flag system (flags, pirate mode, war mode)
- Combat tactics by ship class
- Weapon selection for PvP
- Armor angle exploitation
- Boarding mechanics
- Arena vs open-world PvP

---

## Phase 5: SEO & Discoverability

### 5.1 Page Titles

Every wiki page follows: `{Topic} — The Iron Tide Wiki`
- "Damage Calculator — The Iron Tide Wiki"
- "Victory (Ship) — The Iron Tide Wiki"
- "Getting Started Guide — The Iron Tide Wiki"

### 5.2 Meta Descriptions

Every page gets a unique, keyword-rich meta description:
- "Calculate exact damage output in World of Sea Battle. Pick your cannon, ammo, and target — uses real game formulas from decompiled source code."
- "The Victory is a Rate I Battle class ship in World of Sea Battle. 5500 HP, 59 broadside weapon slots. Full stats, crafting cost, and recommended loadouts."

### 5.3 Structured Data (JSON-LD)

Add FAQ schema to guide pages, Article schema to content pages.

### 5.4 Sitemap

Auto-generate `sitemap.xml` including all wiki pages with proper `lastmod` dates.

### 5.5 Keywords & Search Intent Mapping

| Search Query | Target Page | Type |
|---|---|---|
| "world of sea battle ships" | /wiki/ships | Data |
| "wosb best ship" | /wiki/ships/classes | Guide |
| "wosb damage calculator" | /wiki/tools/damage-calculator | Tool |
| "world of sea battle beginner guide" | /wiki/getting-started | Guide |
| "wosb cannon damage" | /wiki/weapons | Data |
| "world of sea battle wiki" | /wiki | Hub |
| "wosb ship comparison" | /wiki/tools/ship-compare | Tool |
| "wosb victory ship stats" | /wiki/ships/victory | Data |
| "wosb armor angle" | /wiki/combat | Guide |
| "wosb trading guide" | /wiki/economy | Guide |
| "wosb ammo types" | /wiki/ammo | Data |
| "wosb crafting cost" | /wiki/tools/crafting-calculator | Tool |
| "wosb factions" | /wiki/factions | Guide |
| "wosb ranks" | /wiki/ranks | Data |
| "wosb arena" | /wiki/arena | Data |
| "wosb guilds" | /wiki/guilds | Data |
| "wosb crew" | /wiki/crew | Data |
| "wosb skills" | /wiki/skills | Data |
| "wosb pvp tips" | /wiki/pvp | Guide |
| "wosb xp calculator" | /wiki/tools/xp-calculator | Tool |

---

## Implementation Plan

### Sprint 1: Foundation (Layout + Cross-Linking)
1. Build wiki layout component with sidebar navigation
2. Add Table of Contents component (auto-generated from headings)
3. Add "See Also" component (reusable across all pages)
4. Add Navigation Box component (category footer boxes)
5. Migrate all existing wiki pages to new layout
6. Add inline cross-links to all existing page content
7. Redesign wiki hub page

### Sprint 2: Interactive Tools
8. Damage Calculator
9. Ship Comparison Tool
10. Crafting Calculator
11. XP Calculator
12. Tools hub page (`/wiki/tools`)

### Sprint 3: New Content
13. Getting Started Guide
14. Ship Class Trees page (visual trees)
15. Faction Guide
16. Economy Guide
17. PvP Guide

### Sprint 4: SEO & Polish
18. Global wiki search
19. Structured data (JSON-LD)
20. Auto-generated sitemap
21. Meta description audit
22. Mobile responsiveness polish
23. Performance optimization (search index, lazy loading)

---

## Technical Notes

- Wiki layout uses Next.js layout.tsx for `/wiki` route group
- Sidebar state persisted in localStorage (expanded/collapsed sections)
- Search index built at build time via generateStaticParams or build script
- All interactive tools are client components, data passed as props from server pages
- Cross-link data can be computed at build time (which ships use which weapons, etc.)
- Nav boxes defined as a shared config file imported by each page

---

## Success Metrics

- **Rabbit hole depth**: Average pages per session > 3 (currently probably 1-2)
- **Search traffic**: Ranking for "world of sea battle wiki" and key game queries
- **Return visits**: Players bookmarking the damage calculator and ship compare tools
- **Completeness**: Every game entity (ship, weapon, crew, resource) has a page or section
- **Zero dead ends**: No page without at least 3 outgoing links to other wiki pages

---

_This is a living document. Update as work progresses._
