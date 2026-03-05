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

function parseRate(rate) {
  if (typeof rate === 'number') return rate;
  const romanMap = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
  return romanMap[String(rate).trim()] || parseInt(rate) || 0;
}

function mapShipClass(category) {
  if (!category) return 'Combat';
  const c = category.toLowerCase();
  if (c.includes('fast')) return 'Fast';
  if (c.includes('combat')) return 'Combat';
  if (c.includes('transport')) return 'Transport';
  if (c.includes('heavy')) return 'Heavy';
  if (c.includes('siege')) return 'Siege';
  if (c.includes('imperial')) return 'Imperial';
  if (c.includes('legend')) return 'Heavy'; // Legend of the Age of Sail
  return 'Combat';
}

async function seedShips() {
  const data = loadJson('ship-stats.json');
  let count = 0;
  for (const s of data.ships) {
    await prisma.ship.upsert({
      where: { name: s.name },
      update: {
        rate: parseRate(s.rate),
        shipClass: mapShipClass(s.category),
        faction: s.nation || null,
        hp: s.stats?.durability || null,
        speed: s.stats?.speed || null,
        cargoHold: s.stats?.hold || null,
        crewCapacity: s.stats?.crew || null,
      },
      create: {
        name: s.name,
        rate: parseRate(s.rate),
        shipClass: mapShipClass(s.category),
        faction: s.nation || null,
        hp: s.stats?.durability || null,
        speed: s.stats?.speed || null,
        cargoHold: s.stats?.hold || null,
        crewCapacity: s.stats?.crew || null,
      },
    });
    count++;
  }
  return count;
}

async function seedWeapons() {
  const data = loadJson('weapon-stats.json');
  let count = 0;
  for (const w of data.weapons) {
    // Extract tier from category (e.g. "Light Cannon" -> "Light")
    const tier = w.category ? w.category.split(' ')[0] : null;
    await prisma.weapon.upsert({
      where: { name: w.name },
      update: {
        type: w.type,
        tier,
        damage: null,
        range: w.stats?.range || null,
        reloadTime: w.stats?.loadTime || null,
      },
      create: {
        name: w.name,
        type: w.type,
        tier,
        damage: null,
        range: w.stats?.range || null,
        reloadTime: w.stats?.loadTime || null,
      },
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
    const effect = description;
    await prisma.upgrade.upsert({
      where: { name: u.name },
      update: { slot: u.category || null, description, effect },
      create: { name: u.name, slot: u.category || null, description, effect },
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
    await prisma.resource.upsert({
      where: { name },
      update: { type: 'Raw' },
      create: { name, type: 'Raw' },
    });
    count++;
  }
  for (const name of processed) {
    await prisma.resource.upsert({
      where: { name },
      update: { type: 'Processed' },
      create: { name, type: 'Processed' },
    });
    count++;
  }
  return count;
}

async function seedCurrencies() {
  const names = ['Gold', 'Battle Marks', 'Voodoo Skulls', 'Escudos', 'Pirate Tokens', 'Imperial Blueprints', 'Blueprint Fragments', 'Coins', 'Chest', 'Chest Key', 'Scrolls', 'Construction License', 'Insurance'];
  let count = 0;
  for (const name of names) {
    await prisma.currency.upsert({
      where: { name },
      update: {},
      create: { name },
    });
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
    await prisma.ammoType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
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
