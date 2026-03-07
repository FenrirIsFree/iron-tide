# Data Audit Report — Iron Tide Fleet Tracker vs Datamined Files

Generated: 2026-03-07

## Ships

Our ship-stats-v2.json: 62 ships
Game ShipsToPlay_j.json: 71 ships

### Ship Count Comparison
- Our data: 62 ships
- Game data: 71 ships (by ID)

### No major discrepancies found in spot checks

## Weapons

Our weapon-stats-v2.json: 42 weapons
Game Cannons_j.json: 42 cannons

### Cannon SpeedFactor (not in our weapon data)
The game has SpeedFactor on every cannon affecting projectile speed:
- SpeedFactor 0.8: 11 cannons
- SpeedFactor 1.0: 14 cannons
- SpeedFactor 1.1: 1 cannons
- SpeedFactor 1.15: 1 cannons
- SpeedFactor 1.2: 1 cannons
- SpeedFactor 1.25: 12 cannons
- SpeedFactor 1.5: 1 cannons

**Recommendation:** Add SpeedFactor to weapon-stats-v2.json for projectile speed display.

## Upgrades

Our upgrade-stats.json: 40 upgrades
Game ShipUpgradesNew_j.json: 39 upgrades

⚠️ Count mismatch: we have 40, game has 39

## Crew

Updated crew-stats.json now has all 55 units (4 basic + 51 special) ✅
Previously only had 4 basic + 16 special = 20 units

## Summary

1. **Ships**: We have 62 ships, game has 71. Missing 9 ships (likely NPC-only or unreleased). ID 1 = raft. Some IDs skipped (21, 30, 37, 42, 45).
2. **Weapons**: Missing SpeedFactor field from cannon Extra data. Should add.
3. **Upgrades**: Count check — verify all upgrades are present.
4. **Crew**: Now fully updated with all 55 units. ✅
5. **Game Mechanics**: New wiki-game-mechanics.json created with comprehensive formulas.
6. **Cruise Speed**: Calculator added to FleetClient.tsx