#!/usr/bin/env python3
"""Cross-reference newly extracted WoSB data with existing game-data in iron-tide repo."""
import json
import os

NEW_DIR = '/tmp/wosb/json'
OLD_DIR = '/home/node/.openclaw/workspace/projects/iron-tide/game-data'

def load_json(path):
    with open(path) as f:
        return json.load(f)

def compare_ships():
    new = load_json(f'{NEW_DIR}/ShipsToPlay_j.json')
    old = load_json(f'{OLD_DIR}/datamined-ships.json')
    loc = load_json(f'{NEW_DIR}/localization_en.json')
    
    old_by_id = {s.get('gameId', s.get('ID')): s for s in old}
    
    changes = []
    new_ships = []
    
    for ship in new:
        sid = ship['ID']
        name = loc.get(f'ship_{sid}_name', f'Ship #{sid}')
        
        if sid not in old_by_id:
            new_ships.append(f"  NEW: {name} (ID {sid}) - {ship.get('Type', '?')}, HP: {ship.get('Health', '?')}")
    
    print(f"=== SHIPS ===")
    print(f"New extraction: {len(new)} ships")
    print(f"Old data: {len(old)} ships")
    if new_ships:
        print("New ships found:")
        for s in new_ships:
            print(s)
    else:
        print("No new ships detected")
    print()

def compare_weapons():
    new = load_json(f'{NEW_DIR}/Cannons_j.json')
    old = load_json(f'{OLD_DIR}/datamined-cannons.json')
    loc = load_json(f'{NEW_DIR}/localization_en.json')
    
    old_ids = {w.get('gameId', w.get('ID')) for w in old}
    new_ids = {w['ID'] for w in new}
    
    added = new_ids - old_ids
    
    print(f"=== WEAPONS ===")
    print(f"New extraction: {len(new)} weapons")
    print(f"Old data: {len(old)} weapons")
    if added:
        print("New weapons:")
        for wid in added:
            name = loc.get(f'{wid}_name', wid)
            print(f"  NEW: {name} ({wid})")
    else:
        print("No new weapons detected")
    print()

def compare_crew():
    new = load_json(f'{NEW_DIR}/UnitsInfo_j.json')
    old = load_json(f'{OLD_DIR}/datamined-units.json')
    
    old_ids = {u.get('gameId', u.get('ID')) for u in old}
    new_ids = {u['ID'] for u in new}
    
    added = new_ids - old_ids
    
    print(f"=== CREW ===")
    print(f"New extraction: {len(new)} crew types")
    print(f"Old data: {len(old)} crew types")
    if added:
        print(f"New crew: {added}")
    else:
        print("No new crew detected")
    print()

def compare_upgrades():
    new = load_json(f'{NEW_DIR}/ShipUpgradesNew_j.json')
    old = load_json(f'{OLD_DIR}/datamined-upgrades.json')
    
    print(f"=== UPGRADES ===")
    print(f"New extraction: {len(new)} upgrades")
    print(f"Old data: {len(old)} upgrades")
    print()

def compare_skills():
    new = load_json(f'{NEW_DIR}/CaptainSkills_j.json')
    print(f"=== CAPTAIN SKILLS ===")
    print(f"New extraction: {len(new)} skills")
    print()

def compare_resources():
    new = load_json(f'{NEW_DIR}/Resources_j.json')
    print(f"=== RESOURCES ===")
    print(f"New extraction: {len(new)} resources")
    print()

def compare_ammo():
    new = load_json(f'{NEW_DIR}/CannonBalls_j.json')
    print(f"=== AMMO ===")
    print(f"New extraction: {len(new)} ammo types")
    print()

def compare_ports():
    new = load_json(f'{NEW_DIR}/WorldPorts_j.json')
    print(f"=== PORTS ===")
    print(f"New extraction: {len(new)} ports")
    print()

def stat_changes_ships():
    """Deep compare ship stats between old and new."""
    new = load_json(f'{NEW_DIR}/ShipsToPlay_j.json')
    old_catalog = load_json(f'{OLD_DIR}/wosb-catalog.json')
    loc = load_json(f'{NEW_DIR}/localization_en.json')
    
    # Build old lookup from catalog
    old_ships = {}
    if isinstance(old_catalog, dict) and 'ShipsToPlay_j' in old_catalog:
        for s in old_catalog['ShipsToPlay_j']:
            old_ships[s['ID']] = s
    elif isinstance(old_catalog, list):
        for s in old_catalog:
            if 'ID' in s and 'Health' in s:
                old_ships[s['ID']] = s
    
    if not old_ships:
        print("=== STAT CHANGES (Ships) ===")
        print("Could not build old ship lookup from catalog")
        return
    
    fields_to_check = ['Health', 'BasicSpeed', 'BasicMobility', 'Armor', 'CapacityCg', 
                        'PlacesForUnitsCount', 'Rank', 'Type', 'RequiredRank', 'ShipCostReal']
    
    changes = []
    for ship in new:
        sid = ship['ID']
        name = loc.get(f'ship_{sid}_name', f'Ship #{sid}')
        old = old_ships.get(sid)
        if old:
            for field in fields_to_check:
                new_val = ship.get(field)
                old_val = old.get(field)
                if new_val != old_val and old_val is not None:
                    changes.append(f"  {name}: {field} {old_val} → {new_val}")
    
    print(f"=== STAT CHANGES (Ships) ===")
    if changes:
        for c in changes:
            print(c)
    else:
        print("No stat changes detected (or old catalog format doesn't match)")
    print()

if __name__ == '__main__':
    compare_ships()
    compare_weapons()
    compare_crew()
    compare_upgrades()
    compare_skills()
    compare_resources()
    compare_ammo()
    compare_ports()
    stat_changes_ships()
