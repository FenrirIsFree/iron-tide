require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const dataDir = path.join(__dirname, '..', '..', 'game-data');

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
}

async function seedShips() {
  const ships = loadJson('ship-stats-v2.json');
  let count = 0;
  for (const s of ships) {
    const data = {
      rate: s.rate,
      shipClass: s.class || 'Unknown',
      role: s.role || null,
      faction: s.faction || null,
      hp: s.hp || null,
      speed: s.speed || null,
      maneuverability: s.maneuverability || null,
      broadsideArmor: s.broadsideArmor || null,
      cargoHold: s.hold || null,
      crewCapacity: s.crew || null,
      displacement: s.displacement || null,
      integrity: s.integrity || null,
      weaponClass: s.weaponClass || null,
      sternSlots: s.weaponSlots?.stern || 0,
      broadsideSlots: s.weaponSlots?.broadside || 0,
      bowSlots: s.weaponSlots?.bow || 0,
      swivelGuns: s.swivelGuns || 0,
      mortarSlots: s.mortarSlots || 0,
      mortarMaxCaliber: s.mortarMaxCaliber || null,
      specialWeaponSlots: s.specialWeaponSlots || 0,
    };
    await prisma.ship.upsert({
      where: { name: s.name },
      update: data,
      create: { name: s.name, ...data },
    });
    count++;
  }
  return count;
}

async function seedWeapons() {
  const weapons = loadJson('weapon-stats-v2.json');
  let count = 0;
  for (const w of weapons) {
    // Parse penetration — can be number or string like "16 x2"
    let penetration = null;
    let penetrationMulti = null;
    if (w.penetration != null) {
      if (typeof w.penetration === 'string' && w.penetration.includes('x')) {
        const parts = w.penetration.split(/\s+/);
        penetration = parseFloat(parts[0]);
        penetrationMulti = parts[1] || null;
      } else {
        penetration = typeof w.penetration === 'number' ? w.penetration : parseFloat(w.penetration);
      }
    }

    const data = {
      weightClass: w.weightClass,
      type: w.type,
      penetration,
      penetrationMulti,
      loading: w.loading || null,
      range: w.range || w.rangeMax || null,
      rangeMin: w.rangeMin || null,
      maxAngle: w.maxAngle || null,
      accuracySpread: w.accuracySpread || null,
      damage: w.damage || null,
      splashRadius: w.splashRadius || null,
      reduction: w.reduction || null,
      preparation: w.preparation || null,
      firingTime: w.firingTime || null,
      damageUnit: w.damageUnit || null,
      caliber: w.caliber || null,
      placementRestriction: w.placementRestriction || null,
      isPremium: w.isPremium || false,
      description: w.notes || null,
    };
    await prisma.weapon.upsert({
      where: { name: w.name },
      update: data,
      create: { name: w.name, ...data },
    });
    count++;
  }
  return count;
}

async function seedUpgrades() {
  const data = loadJson('upgrade-stats.json');
  let count = 0;
  for (const u of data.upgrades) {
    const description = u.effects
      ? u.effects.map(e => `${e.stat}: ${e.value}`).join('; ')
      : u.description || null;
    await prisma.upgrade.upsert({
      where: { name: u.name },
      update: { slot: u.category || null, description, effect: description },
      create: { name: u.name, slot: u.category || null, description, effect: description },
    });
    count++;
  }
  return count;
}

async function seedConsumables() {
  const data = loadJson('consumable-stats.json');
  let count = 0;
  const allConsumables = [];
  for (const items of Object.values(data.categories)) {
    allConsumables.push(...items);
  }
  for (const c of allConsumables) {
    const effectStr = c.effects
      ? Object.entries(c.effects).map(([k, v]) => `${k}: ${v}`).join('; ')
      : null;
    await prisma.consumable.upsert({
      where: { name: c.name },
      update: { category: c.category || null, description: c.description || null, effect: effectStr },
      create: { name: c.name, category: c.category || null, description: c.description || null, effect: effectStr },
    });
    count++;
  }
  return count;
}

async function seedResources() {
  const raw = ['Wood', 'Iron Ore', 'Copper Ore', 'Coal', 'Fish', 'Resin', 'Wreckage', 'Whale Oil', 'Fresh Meat', 'Grain', 'Water', 'Volcanic Ore', 'Animals', 'Antiquities', 'Captives', 'Supplies'];
  const processed = ['Iron', 'Copper', 'Bronze', 'Canvas', 'Fabric', 'Beam', 'Bulkhead', 'Plate', 'Tackle', 'Rum', 'Provision'];
  let count = 0;
  for (const name of raw) {
    await prisma.resource.upsert({ where: { name }, update: { type: 'Raw' }, create: { name, type: 'Raw' } });
    count++;
  }
  for (const name of processed) {
    await prisma.resource.upsert({ where: { name }, update: { type: 'Processed' }, create: { name, type: 'Processed' } });
    count++;
  }
  return count;
}

async function seedCurrencies() {
  const names = ['Gold', 'Battle Marks', 'Voodoo Skulls', 'Escudos', 'Pirate Tokens', 'Imperial Blueprints', 'Blueprint Fragments', 'Coins', 'Chest', 'Chest Key', 'Scrolls', 'Construction License', 'Insurance'];
  let count = 0;
  for (const name of names) {
    await prisma.currency.upsert({ where: { name }, update: {}, create: { name } });
    count++;
  }
  return count;
}

async function seedCrewTypes() {
  const data = loadJson('crew-stats.json');
  let count = 0;
  for (const c of data.crew) {
    await prisma.crewType.upsert({
      where: { name: c.name },
      update: { description: c.description || null },
      create: { name: c.name, description: c.description || null },
    });
    count++;
  }
  for (const c of data.specialCrew) {
    await prisma.crewType.upsert({
      where: { name: c.name },
      update: { description: c.ability || null },
      create: { name: c.name, description: c.ability || null },
    });
    count++;
  }
  return count;
}

async function seedAmmoTypes() {
  const names = ['Round Shots', 'Heated Shots', 'Grapeshot', 'Bar Shots', 'Strike Rounds', 'Phosphorous Shots', 'Shrapnel Rounds', 'Burning Arrows', 'Snowballs'];
  let count = 0;
  for (const name of names) {
    await prisma.ammoType.upsert({ where: { name }, update: {}, create: { name } });
    count++;
  }
  return count;
}

async function main() {
  console.log('🌱 Seeding Iron Tide database...\n');

  const ships = await seedShips();
  console.log(`✅ Ships: ${ships}`);

  const weapons = await seedWeapons();
  console.log(`✅ Weapons: ${weapons}`);

  const upgrades = await seedUpgrades();
  console.log(`✅ Upgrades: ${upgrades}`);

  const consumables = await seedConsumables();
  console.log(`✅ Consumables: ${consumables}`);

  const resources = await seedResources();
  console.log(`✅ Resources: ${resources}`);

  const currencies = await seedCurrencies();
  console.log(`✅ Currencies: ${currencies}`);

  const crewTypes = await seedCrewTypes();
  console.log(`✅ Crew Types: ${crewTypes}`);

  const ammoTypes = await seedAmmoTypes();
  console.log(`✅ Ammo Types: ${ammoTypes}`);

  const total = ships + weapons + upgrades + consumables + resources + currencies + crewTypes + ammoTypes;
  console.log(`\n🎉 Total records seeded: ${total}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
