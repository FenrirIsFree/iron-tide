# WoSB Datamining Guide

*How to extract and update game data from World of Sea Battle.*
*Last updated: 2026-03-07*

---

## Overview

World of Sea Battle uses **TheraEngine** (XNA/MonoGame-based, NOT Unity). Game data is stored in password-protected zip archives containing XNB files with JSON payloads.

## Required Tools

| Tool | Purpose | Where to Get |
|------|---------|-------------|
| **ILSpy** | .NET decompiler (for code analysis) | https://github.com/icsharpcode/ILSpy |
| **7-Zip** | Extract .wosb archives | https://7-zip.org |
| **Python 3** | Parse JSON from XNB files | Pre-installed |

## Game File Locations

### Windows (Steam)
```
C:\Program Files (x86)\Steam\steamapps\common\World of Sea Battle\
```

### Key Files
| File | Purpose |
|------|---------|
| `_lzcommon` | Main data archive (rename to `.wosb` or extract with 7-Zip) |
| `local_en.fx` | English localization (key-value pairs, space-separated) |
| `Common.dll` | Game logic DLL (decompile with ILSpy for code analysis) |
| `WorldOfSeaBattleClient.dll` | Client-side code |
| `TheraEngine.dll` | Engine code (contains HeapLoader) |

## Step 1: Extract the Data Archive

The `_lzcommon` file is a zip archive using **ICSharpCode.SharpZipLib**.

**Password: `wosb1010`**

### Using 7-Zip (recommended)
```bash
7zz x -p"wosb1010" -o./extracted _lzcommon.wosb
```

### Using Python (if 7-Zip unavailable)
```python
# Python's zipfile module may fail with "compression method not supported"
# Use 7-Zip instead — SharpZipLib uses a newer compression version (5.1)
```

### Expected Output
- **797 files** total
- **28 top-level XNB files** (JSON data tables)
- **13 item folders** (binary assets — icons/textures)

## Step 2: Extract JSON from XNB Files

XNB files have a small binary header, then raw JSON. Extract by finding the first `[` or `{` byte:

```python
import json

def extract_json_from_xnb(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
    for i, b in enumerate(data):
        if b in (0x5b, 0x7b):  # [ or {
            text = data[i:].decode('utf-8', errors='ignore').rstrip('\x00').rstrip()
            return json.loads(text)
    return None  # Binary asset (icon/texture), no JSON
```

## Step 3: Parse Localization

`local_en.fx` uses **space-separated** key-value format (NOT tab-separated):

```python
loc = {}
with open('local_en.fx', 'r', errors='ignore') as f:
    for line in f:
        line = line.strip()
        idx = line.find(' ')
        if idx > 0:
            loc[line[:idx]] = line[idx+1:]
```

### Name Key Patterns
| Data Type | Localization Key | Example |
|-----------|-----------------|---------|
| Ships | `ship_{ID}_name` | `ship_15_name` → "Friede" |
| Upgrades | `upgrade_{N}_name` | `upgrade_10_name` → "Reinforced Masts" |
| Cannons | `ncs_cannon_{N}_name` | `ncs_cannon_1_name` → "6-pdr Rusty Cannon" |
| Cannonballs | `cball_{ID}_name` | `cball_1_name` → "Round Shots" |
| Crew/Units | `{ID}_name` | `unit_sailor_1_name` → "Sailor" |
| Skills | `skill_{N}_name` | `skill_18_name` → "Spyglass" |
| Kegs | `pkeg_{N}_name` | `pkeg_1_name` → "Small Gunpowder Barrels" |
| Resources | `res_{N}_name` | `res_10_name` → "Grain" |
| Consumables | `item_name{N}` | `item_name0` → "Wooden Patches" |
| Ports | `{PortName}` | `nport_0` → (port name) |
| Achievements | `achiv_{N}_name` | `achiv_1_name` → "First Blood" |
| Ship descriptions | `ship_{ID}_desc` | Full ship lore text |
| Upgrade tooltips | `upgrade_{N}_tt` | Detailed upgrade description |
| Skill descriptions | `skill_{N}_desc` | Skill effect description |

## Data File Reference

### Top-Level Data Files (JSON arrays)

| File | Items | Description |
|------|-------|-------------|
| `ShipsToPlay_j.xnb` | 71 | Ship stats (HP, speed, armor, etc.) |
| `ShipsBasics_j.xnb` | 68 | Ship model data (hitboxes, weight) |
| `Cannons_j.xnb` | 42 | Weapon stats (damage, range, reload) |
| `CannonBalls_j.xnb` | 21 | Ammo types (effects, damage multipliers) |
| `ShipUpgradesNew_j.xnb` | 39 | Upgrade effects (raw effect strings) |
| `UnitsInfo_j.xnb` | 55 | Crew types (damage, health, abilities) |
| `Resources_j.xnb` | 75 | Resources (cost, mass, effects) |
| `CaptainSkills_j.xnb` | 55 | Captain skills (effects, costs, tree) |
| `PowderKegs_j.xnb` | 8 | Explosive barrels (damage, radius) |
| `ShipDesingElements_j.xnb` | 562 | Cosmetics (flags, figureheads, paint) |
| `Achievements_j.xnb` | 57 | Achievement definitions |
| `RangInfo_j.xnb` | 29 | Rank XP requirements |
| `WorldPorts_j.xnb` | 42 | Port data (type, build ranks, resources) |
| `TradingRoutesInfo.xnb` | 105 | Trading route definitions |
| `GuildTitles_j.xnb` | 20 | Guild title rewards |
| `PortLevelBonuses_j.xnb` | 25 | Port upgrade bonuses |
| `ArenaUpgrades_j.xnb` | 11 | Arena battle upgrades |
| `Gamepedia_j.xnb` | 30 | In-game wiki entries |
| `InterestPoints_j.xnb` | 16 | Map points of interest |
| `EnvDesingElements_j.xnb` | 46 | Environmental decorations |
| `MapsArena_j.xnb` | 16 | Arena map layouts |
| `MapsForPassing_j.xnb` | 12 | PvE mission definitions |
| `ProceduralPresets_j.xnb` | 188 | Procedural generation presets |
| `World_j.xnb` | 1 | World map definition (islands, layout) |
| `StartMap_j.xnb` | 1 | Tutorial/start map |

### Item Folders (Binary Assets — Icons/Textures)

These are XNB-packed images, NOT JSON. They contain item icons.

| Folder | Files | Content |
|--------|-------|---------|
| `Items/Ships/` | 132 | Ship icons (color + grayscale) |
| `Items/Cannons/` | 65 | Weapon icons |
| `Items/CannonBalls/` | 30 | Ammo type icons |
| `Items/ShipUpgrades/` | 38 | Upgrade icons |
| `Items/Units/` | 51 | Crew type icons |
| `Items/Resources/` | 69 | Resource icons |
| `Items/PowerupItems/` | 41 | Consumable icons |
| `Items/PowderKegs/` | 14 | Barrel/mine icons |
| `Items/Skills/` | 42 | Captain skill icons |
| `Items/Achievements/` | 57 | Achievement icons |
| `Items/DesingElements/` | 150 | Cosmetic icons |
| `Items/Fractions/` | 12 | Faction emblems |
| `Items/EnvDecor/` | 48 | Environmental decoration icons |

## Key Data Schemas

### ShipsToPlay_j (Ship Stats)
```json
{
  "StaticInfoID": 15,       // Links to ShipsBasics index (1-based)
  "ID": 15,                 // Unique ship ID (used for ship_{ID}_name)
  "Coolness": "Default",    // Default|Unique|Elite|Empire
  "CanBeUsedForNpc": false,
  "ShipCostReal": 0,        // Real-money cost (0 = gold only)
  "Health": 750,             // HP
  "BasicSpeed": 8.8,         // Internal speed (display as-is for knt)
  "BasicMobility": 86,       // Maneuverability (degrees/10sec)
  "Armor": 2.2,              // Broadside armor
  "CapacityCg": 11000,       // Hold capacity (kg)
  "PlacesForUnitsCount": 18, // Crew capacity (display value)
  "Rank": 6,                 // 0=Admiral, 6=Starter
  "Type": "CargoShip",       // Destroyer|Battleship|CargoShip|Hardship|Mortar
  "Subtype": "subclass_flute",
  "RequiredRank": 1,
  "ExtraPlacesForUpgrades": 0,
  "Fraction": "Espaniol"     // None|Espaniol|Antilia|KaiAndSeveria|Empire
}
```

**ID mapping notes:**
- Ship names use `ship_{ID}_name` where ID = the `ID` field
- Some ships share the same `StaticInfoID` (variants/mods use same 3D model)
- `StaticInfoID` maps to `ShipsBasics_j` array index (1-based)

### ShipUpgradesNew_j (Upgrade Effects)
```json
{
  "Name": "upgrade_10_name",
  "EffectsBoost": "MSpeed +1.2,+1.2,+1.2,+1.0,+1.0,+0.8,+0.8; MPlayerJerkEffectPowerAdd +1.2,...",
  "IconName": "up_r3",
  "LowStrength": false,
  "LowCost": false,
  "MainCraftResource": "",
  "Category": "Speed",       // Combat|Protection|Speed|Support|Mortars|Unique|Sailes|Modification
  "WearType": "SailingDistance"  // ReceivedDamage|SailingDistance|ShotsCount
}
```

### Effect String Format
Effects are semicolon-separated. Each effect: `{Key} {Value}`

**Prefix meanings:**
| Prefix | Type | Example |
|--------|------|---------|
| `M` | Flat modifier, per-rank tiered (7 values: R6→R0) | `MHealth +80,+80,+80,+150,+150,+210,+210` |
| `P` | Percentage modifier | `PSpeed +4` means +4% |
| `B` | Boolean flag | `BExtraMortars +1` means enabled |
| `MP` | Flat per-rank, applied as reduction | `MPReduceCannonsQuantity 0` |
| `C` | Captain skill constant | `CWorkshopLevel +1` |

**⚠️ Known conversion factors:**
- **`MSpeed` values are 2x display knots.** Divide by 2 for display. (e.g., internal +1.2 = display +0.6 knt)
- **`MPlayerJerkEffectPowerAdd`** displays as-is (no conversion)
- **Percentage values (`P` prefix)** display as-is with % sign

**Per-rank tiered values:**
Array of 7 values: `[Rank6, Rank5, Rank4, Rank3, Rank2, Rank1, Rank0]`
- Rank 6 = lowest (starter ships like Sloop, Pickle)
- Rank 0 = highest (Victory, Santisima Trinidad)
- Our DB `rate` field: 1=highest → 7=lowest
- Index formula: `rankedValues[7 - rate]`

### Cannons_j (Weapon Stats)
```json
{
  "ID": "ncs_cannon_1",
  "Class": "LiteCannon Default",   // {WeightType} {Quality}
  "Category": "Light CastIron",    // {WeightClass} {Material}
  "Distance": "125",               // Range
  "Penetration": 13,               // Damage per shot
  "Cooldown": 10.5,                // Reload time (seconds)
  "Angle": 34,                     // Firing angle
  "Scatter": 8.5,                  // Accuracy spread
  "Extra": "SpeedFactor:1",        // Special properties
  "CraftingType": "ByGold",        // How to acquire
  "Price": 50,
  "Icon": "light_rusty_cannon",
  "Model": "Cannon_rust_small"
}
```

### UnitsInfo_j (Crew Stats)
```json
{
  "ID": "unit_sailor_1",
  "Type": "Sailor",          // Sailor|Boarding|Special
  "DDamage": 15,              // Boarding damage
  "DHealth": 380,             // Boarding health
  "DCapacity": 30,            // Capacity per unit
  "Cost": 15,                 // Gold cost
  "CostMarks": 0,             // War marks cost
  "Options": "All",           // Faction restriction
  "Effect": "",               // Passive effect
  "EffectPerSailor": "",      // Per-sailor bonus
  "EffectPerBoardingUnit": "",// Per-boarding-unit bonus
  "IconName": "crew1"
}
```

### CannonBalls_j (Ammo Types)
```json
{
  "ID": "cball_1",
  "Speed": 1,                 // Speed multiplier
  "Penetration": 0,           // Additional penetration
  "DamageFactor": 1,          // Damage multiplier
  "DamageToSailes": 3.5,      // Sail damage multiplier
  "MinDamageThroughAnyHitbox": 0,
  "CrewDamage": 0.2,          // Crew damage multiplier
  "Effects": "CanMakeAnyBurnings",  // Space-separated effect flags
  "MassKg": 1,
  "Radius": 0.2,
  "CurveMultiplier": 1,
  "DistanceFactor": 1,        // Range multiplier
  "ReloadFactor": 1,          // Reload time multiplier
  "IconTexture": "CannonBall1",
  "IsRare": false,
  "SingleCost": 1
}
```

### CaptainSkills_j (Captain Skills)
```json
{
  "Name": "skill_18",
  "CostPoints": 0,            // Skill points cost
  "Cost": "gold 250",         // Additional gold cost
  "Effect": "BSpyglassImprovements +1",  // Same effect format as upgrades
  "UiCategory": 0,            // Skill tree category
  "UiPosition": "100 0",      // Position in skill tree UI
  "DependsTo": "",             // Prerequisite skill
  "RequiredAchievements": "",
  "RequiredShips": "",
  "RequiredRank": "",          // Minimum rank required
  "IconTextureName": "c_icon_spyglass"
}
```

### RangInfo_j (Rank XP Requirements)
```json
{"Xp": 140}   // Index 0 = Rank 29, ascending
```
Array of 29 entries, each with XP needed for that rank.

## Step 4: Cross-Reference with Existing Catalog

After extracting new data, compare with the seeded database:

```python
# Load new game data
new_ships = extract_json_from_xnb('extracted/ShipsToPlay_j.xnb')

# Compare with existing catalog
with open('game-data/datamined-ships.json') as f:
    old_ships = json.load(f)

old_by_id = {s['gameId']: s for s in old_ships}
for ship in new_ships:
    old = old_by_id.get(ship['ID'])
    if old:
        # Compare stats
        for field, old_field in [('Health','health'), ('BasicSpeed','speed'), ...]:
            if ship[field] != old[old_field]:
                print(f"CHANGED: {ship['ID']} {field}: {old[old_field]} → {ship[field]}")
    else:
        print(f"NEW SHIP: ID {ship['ID']}")
```

## Step 5: Code Analysis (When Needed)

For things not in data files (like per-ship Mortar Fitted values), decompile `Common.dll`:

1. Open `Common.dll` in ILSpy
2. Key namespaces:
   - `Common.Data` → `GameLoader`, `XmlAsset`, data loading
   - `Common.Resources` → `ShipStaticInfo`, `NpcInfo`, ship definitions
   - `Common.Game` → Gameplay logic
   - `World_Of_Sea_Battle.Constants` → Game constants
3. Search for specific effect keys (e.g., `MSpeed`, `BExtraMortars`)

### Key Classes
| Class | Location | Contains |
|-------|----------|----------|
| `GameLoader` | Common.Data | Data file loading entry point |
| `HeapLoader` | TheraEngine.Core | Archive extraction (password here) |
| `ShipStaticInfo` | Common.Resources | Per-ship static data (ports, hitboxes) |
| `ShipBonusEffect` | Common.Resources | Effect enum (all effect types) |
| `NpcInfo` | Common.Resources | Ship runtime state |

## Automation Script

Full extraction pipeline (run from VPS):

```bash
#!/bin/bash
# Extract WoSB game data
# Prereqs: 7zz binary, python3

GAME_DIR="/tmp/wosb"
EXTRACTED="$GAME_DIR/extracted"
JSON_DIR="$GAME_DIR/json"

# 1. Extract archive
mkdir -p "$EXTRACTED"
/tmp/7zz x -p"wosb1010" -o"$EXTRACTED" "$GAME_DIR/_lzcommon.wosb" -y

# 2. Extract JSON from XNB files
python3 extract_all_json.py "$EXTRACTED" "$JSON_DIR"

# 3. Map names from localization
python3 map_names.py "$GAME_DIR/local_en.fx" "$JSON_DIR"

# 4. Cross-reference with existing catalog
python3 cross_reference.py "$JSON_DIR" "game-data/"
```

## Update Checklist

When a game update drops:

- [ ] Copy updated `_lzcommon`, `local_en.fx`, and DLLs to VPS
- [ ] Extract with 7-Zip using password `wosb1010`
- [ ] Run JSON extraction on all XNB files
- [ ] Cross-reference ships, weapons, upgrades, crew against existing data
- [ ] Check for new entries (new ships, weapons, etc.)
- [ ] Check for stat changes on existing items
- [ ] Update `datamined-*.json` files
- [ ] Re-seed database
- [ ] If code changes needed (new mechanics), decompile `Common.dll` with ILSpy
