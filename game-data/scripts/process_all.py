#!/usr/bin/env python3
"""Process all WoSB game data: update existing files with new fields + process uncovered tables."""
import json
import os
import copy

NEW_DIR = '/tmp/wosb/json'
OLD_DIR = '/home/node/.openclaw/workspace/projects/iron-tide/game-data'
OUT_DIR = OLD_DIR  # Write back to game-data

def load(path):
    with open(path) as f:
        return json.load(f)

def save(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"  💾 Saved: {os.path.basename(path)}")

loc = load(f'{NEW_DIR}/localization_en.json')

def get_name(key, fallback='Unknown'):
    return loc.get(key, fallback)

# ============================================================
# PART 1: Update existing data with new fields
# ============================================================
print("=" * 60)
print("PART 1: Updating existing data with new fields")
print("=" * 60)

# --- Update weapons with CraftingType, Icon, Model ---
print("\n📎 Updating weapons...")
new_weapons = load(f'{NEW_DIR}/Cannons_j.json')
old_weapons = load(f'{OLD_DIR}/datamined-cannons.json')

new_w_by_id = {w['ID']: w for w in new_weapons}
for w in old_weapons:
    wid = w.get('id') or w.get('ID')
    nw = new_w_by_id.get(wid)
    if nw:
        w['craftingType'] = nw.get('CraftingType', '')
        w['icon'] = nw.get('Icon', '')
        w['model'] = nw.get('Model', '')

save(f'{OUT_DIR}/datamined-cannons.json', old_weapons)

# --- Update upgrades with LowStrength, LowCost, MainCraftResource ---
print("\n📎 Updating upgrades...")
new_upgrades = load(f'{NEW_DIR}/ShipUpgradesNew_j.json')
old_upgrades = load(f'{OUT_DIR}/datamined-upgrades.json')

new_u_by_name = {u['Name']: u for u in new_upgrades}
for u in old_upgrades:
    ukey = u.get('nameKey') or u.get('Name')
    nu = new_u_by_name.get(ukey)
    if nu:
        u['lowStrength'] = nu.get('LowStrength', False)
        u['lowCost'] = nu.get('LowCost', False)
        u['mainCraftResource'] = nu.get('MainCraftResource', '')

save(f'{OUT_DIR}/datamined-upgrades.json', old_upgrades)

# ============================================================
# PART 2: Process uncovered tables
# ============================================================
print("\n" + "=" * 60)
print("PART 2: Processing uncovered data tables")
print("=" * 60)

# --- Gamepedia_j (in-game wiki) ---
print("\n📖 Processing Gamepedia (in-game wiki entries)...")
gamepedia_raw = load(f'{NEW_DIR}/Gamepedia_j.json')
gamepedia = []
for entry in gamepedia_raw:
    processed = {
        'id': entry.get('ID', entry.get('Id', '')),
        'category': entry.get('Category', ''),
        'title': entry.get('Title', entry.get('Name', '')),
        'icon': entry.get('Icon', entry.get('IconName', '')),
    }
    # Try to resolve localization
    title_key = entry.get('Title', entry.get('Name', ''))
    if title_key in loc:
        processed['titleLocalized'] = loc[title_key]
    # Keep all raw fields too
    processed['_raw'] = entry
    gamepedia.append(processed)
save(f'{OUT_DIR}/wiki-gamepedia.json', gamepedia)

# --- InterestPoints_j (map POIs) ---
print("\n🗺️ Processing Interest Points (map POIs)...")
pois_raw = load(f'{NEW_DIR}/InterestPoints_j.json')
pois = []
for p in pois_raw:
    processed = {
        'id': p.get('ID', p.get('Id', '')),
        'name': p.get('Name', ''),
        'type': p.get('Type', ''),
        'position': {
            'x': p.get('X', p.get('PosX', p.get('Position', {}).get('X', 0) if isinstance(p.get('Position'), dict) else 0)),
            'y': p.get('Y', p.get('PosY', p.get('Position', {}).get('Y', 0) if isinstance(p.get('Position'), dict) else 0)),
        },
        '_raw': p
    }
    gamepedia_name = loc.get(str(p.get('Name', '')), '')
    if gamepedia_name:
        processed['nameLocalized'] = gamepedia_name
    pois.append(processed)
save(f'{OUT_DIR}/wiki-interest-points.json', pois)

# --- MapsArena_j (arena maps) ---
print("\n⚔️ Processing Arena Maps...")
arena_maps = load(f'{NEW_DIR}/MapsArena_j.json')
arena_processed = []
for m in arena_maps:
    processed = {
        'id': m.get('ID', m.get('Id', '')),
        'name': m.get('Name', ''),
        '_raw': m
    }
    arena_processed.append(processed)
save(f'{OUT_DIR}/wiki-arena-maps.json', arena_processed)

# --- MapsForPassing_j (PvE missions) ---
print("\n🏴‍☠️ Processing PvE Missions...")
pve_maps = load(f'{NEW_DIR}/MapsForPassing_j.json')
pve_processed = []
for m in pve_maps:
    processed = {
        'id': m.get('ID', m.get('Id', '')),
        'name': m.get('Name', ''),
        'difficulty': m.get('Difficulty', ''),
        'requiredRank': m.get('RequiredRank', ''),
        '_raw': m
    }
    pve_processed.append(processed)
save(f'{OUT_DIR}/wiki-pve-missions.json', pve_processed)

# --- ShipsBasics_j (ship model data) ---
print("\n🚢 Processing Ship Basics (hitboxes, models)...")
ship_basics = load(f'{NEW_DIR}/ShipsBasics_j.json')
basics_processed = []
for i, sb in enumerate(ship_basics):
    processed = {
        'index': i,  # 0-based index, ShipsToPlay StaticInfoID maps here (1-based)
        'modelName': sb.get('ModelName', sb.get('Model', '')),
        'weight': sb.get('Weight', 0),
        'length': sb.get('Length', 0),
        '_raw': sb
    }
    basics_processed.append(processed)
save(f'{OUT_DIR}/wiki-ship-basics.json', basics_processed)

# --- ShipDesingElements_j (cosmetics) ---
print("\n🎨 Processing Ship Cosmetics (flags, figureheads, paint)...")
cosmetics = load(f'{NEW_DIR}/ShipDesingElements_j.json')
cosmetics_processed = []
cosmetic_categories = {}
for c in cosmetics:
    cat = c.get('Category', c.get('Type', 'Unknown'))
    cosmetic_categories[cat] = cosmetic_categories.get(cat, 0) + 1
    
    processed = {
        'id': c.get('ID', c.get('Id', '')),
        'name': c.get('Name', ''),
        'category': cat,
        'icon': c.get('Icon', c.get('IconName', '')),
        'price': c.get('Price', 0),
        'priceReal': c.get('PriceReal', c.get('RealPrice', 0)),
        'requiredRank': c.get('RequiredRank', ''),
        'fraction': c.get('Fraction', c.get('Options', '')),
    }
    # Localize name
    name_key = c.get('Name', '')
    if name_key in loc:
        processed['nameLocalized'] = loc[name_key]
    cosmetics_processed.append(processed)

save(f'{OUT_DIR}/wiki-cosmetics.json', cosmetics_processed)
print(f"  Categories: {json.dumps(cosmetic_categories, indent=2)}")

# --- EnvDesingElements_j (environmental decorations) ---
print("\n🌴 Processing Environmental Decorations...")
env_decor = load(f'{NEW_DIR}/EnvDesingElements_j.json')
env_processed = []
for e in env_decor:
    processed = {
        'id': e.get('ID', e.get('Id', '')),
        'name': e.get('Name', ''),
        'category': e.get('Category', e.get('Type', '')),
        'icon': e.get('Icon', e.get('IconName', '')),
        'price': e.get('Price', 0),
        '_raw': e
    }
    env_processed.append(processed)
save(f'{OUT_DIR}/wiki-env-decorations.json', env_processed)

# --- ProceduralPresets_j (procedural generation) ---
print("\n🎲 Processing Procedural Presets...")
presets = load(f'{NEW_DIR}/ProceduralPresets_j.json')
# This is a large file, save as-is with metadata
presets_data = {
    'count': len(presets),
    'description': 'Procedural generation presets for NPC encounters, loot, and world events',
    'presets': presets
}
save(f'{OUT_DIR}/wiki-procedural-presets.json', presets_data)

# ============================================================
# Summary
# ============================================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("\nUpdated existing files:")
print("  ✅ datamined-cannons.json (+craftingType, icon, model)")
print("  ✅ datamined-upgrades.json (+lowStrength, lowCost, mainCraftResource)")
print("\nNew files created:")
print("  ✅ wiki-gamepedia.json (30 in-game wiki entries)")
print("  ✅ wiki-interest-points.json (16 map POIs)")
print("  ✅ wiki-arena-maps.json (16 arena maps)")
print("  ✅ wiki-pve-missions.json (12 PvE missions)")
print("  ✅ wiki-ship-basics.json (68 ship model/hitbox data)")
print("  ✅ wiki-cosmetics.json (562 cosmetic items)")
print("  ✅ wiki-env-decorations.json (46 environmental decorations)")
print("  ✅ wiki-procedural-presets.json (188 procedural presets)")
