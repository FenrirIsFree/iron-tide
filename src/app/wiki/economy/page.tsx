import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import WikiLink from '@/components/wiki/WikiLink'
import Link from 'next/link'

export const metadata = {
  title: 'Economy Guide — The Iron Tide Wiki',
  description: 'Complete economy guide for World of Sea Battle — trading mechanics, resources, crafting, port bonuses, and tax rates.',
}

// Data from wiki-trading.json
const TRADING_CONSTANTS = {
  tradeOrderLifetimeDays: 7,
  tradeOrderLifetimeHoldingDays: 14,
  p2pTradingTax: 0.07,
  rareItemTradingTax: 0.12,
  guildMemberTaxDiscount: 0.75,
  enemyFactionTaxPenalty: 2.0,
}

const TRADE_PRICE_RANGES = [
  { type: 'Standard Items', min: '0.666×', max: '4×', note: 'Most crafting materials and goods' },
  { type: 'Rare Items', min: '1×', max: '30×', note: 'Marks, Voodoo Skulls, Escudo, Pearl, Ancient Artifact, Treasure Map, Ice Blocks' },
  { type: 'Whale Oil', min: '0.666×', max: '15×', note: '' },
  { type: 'Volcanic Ore', min: '1×', max: '40×', note: '' },
  { type: 'Gems', min: '1×', max: '1000×', note: 'Extreme price variation' },
  { type: 'Ammo', min: '0.666×', max: '8×', note: '' },
  { type: 'Ships', min: '0.75×', max: '4×', note: 'Based on total craft cost + gold cost' },
  { type: 'Cannons', min: '0.75×', max: '8×', note: '' },
]

const HIGH_TAX_ITEMS = [
  'Gold Fish', 'Marks', 'Voodoo Skulls', 'Ancient Artifact',
  'Pearl', 'Escudo', 'Treasure Map', 'Imperial Legend currency',
]

const PORT_RESOURCES = {
  allPorts: ['Wood', 'Resin'],
  PirateBay: ['Iron', 'Coal', 'Rum', 'Livestock'],
  City: ['Coal', 'Rum', 'Fabric', 'Copper'],
  Bay: ['Fabric', 'Corn', 'Rum', 'Meat/Provisions'],
  NeutralBay: ['Fabric', 'Corn', 'Rum', 'Meat/Provisions'],
}

const PORT_BONUSES = [
  { type: 'Resource Production', receiver: 'All', values: [100, 200, 300, 400, 500, 600, 700], unit: 'units/cycle' },
  { type: 'Crew Limit', receiver: 'All', values: [300, 500, 900, 1100, 1350, 1600, 2000], unit: 'crew' },
  { type: 'Capital Restore Discount', receiver: 'Nation', values: [0, 4, 8, 10, 12, 16, 20], unit: '%' },
  { type: 'Ship Craft & Repair Time Reduction', receiver: 'Nation', values: [0, 5, 10, 12, 15, 20, 25], unit: '%' },
  { type: 'Factories Mining Speed', receiver: 'Nation', values: [0, 3, 5, 10, 15, 20, 25], unit: '%' },
  { type: 'Recovery Time After Sink', receiver: 'Nation', values: [0, 5, 5, 10, 15, 20, 25], unit: '%' },
  { type: 'Ship Craft Discount', receiver: 'Trader HQ', values: [0, 3, 5, 7, 9, 11, 12], unit: '%' },
  { type: 'All Craft Time Reduction', receiver: 'Trader HQ', values: [0, 2, 4, 8, 12, 16, 20], unit: '%' },
  { type: 'Auction Lot Limit', receiver: 'Trader HQ', values: [1, 3, 5, 7, 9, 11, 13], unit: 'lots' },
  { type: 'Powerup Items Craft Discount', receiver: 'Nation / Pirate', values: [0, 0, 0, 5, 10, 15, 20], unit: '%' },
  { type: 'Weapon Craft Discount', receiver: 'Trader HQ', values: [0, 0, 0, 15, 18, 21, 25], unit: '%' },
  { type: 'Ship Decraft Effectiveness', receiver: 'Pirate', values: [5, 10, 15, 20, 25, 30, 35], unit: '%' },
]

export default function EconomyPage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Economy Guide" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">💰 Economy Guide</h1>
        <p className="text-foreground-secondary mt-1">
          Trading, resources, crafting, and port bonuses — how gold flows in the Archipelago
        </p>
      </div>

      {/* Contents */}
      <div className="mb-8 bg-surface border border-surface-border rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-3">Contents</p>
        <ol className="space-y-1 text-sm text-accent columns-2">
          <li><a href="#trading-basics" className="hover:underline">1. Trading Basics</a></li>
          <li><a href="#taxes" className="hover:underline">2. Tax System</a></li>
          <li><a href="#price-ranges" className="hover:underline">3. Price Ranges</a></li>
          <li><a href="#port-resources" className="hover:underline">4. Port Resources</a></li>
          <li><a href="#port-bonuses" className="hover:underline">5. Port Bonuses</a></li>
          <li><a href="#crafting" className="hover:underline">6. Crafting Overview</a></li>
          <li><a href="#pirate-economy" className="hover:underline">7. Pirate Economy</a></li>
        </ol>
      </div>

      {/* Trading Basics */}
      <section id="trading-basics" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">1. Trading Basics</h2>
        <p className="text-foreground-secondary mb-4">
          Trading in WoSB uses a player-driven auction system. Players post buy and sell orders at ports; other players fill them. You can also trade directly at sea with nearby players within{' '}
          <strong>13 sea units</strong>. Orders stay active for{' '}
          <strong>{TRADING_CONSTANTS.tradeOrderLifetimeDays} days</strong> (
          {TRADING_CONSTANTS.tradeOrderLifetimeHoldingDays} days if holding goods).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-1">📋 Trade Orders</p>
            <p className="text-sm text-foreground-secondary">
              Post buy/sell orders at any port. Orders expire after {TRADING_CONSTANTS.tradeOrderLifetimeDays} days.
              Viewing all auction data costs <strong>500 gold</strong>.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-1">🌊 Sea Trading</p>
            <p className="text-sm text-foreground-secondary">
              Trade directly with players within 13 sea units. Useful for quick deals without docking. Subject to standard P2P taxes.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-1">🔄 Refreshing Offers</p>
            <p className="text-sm text-foreground-secondary">
              Pirate Trader offers can be refreshed for <strong>4 Escudo</strong> per refresh.
            </p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm font-semibold text-amber-400 mb-1">Tip: Guild Discount</p>
          <p className="text-sm text-foreground-secondary">
            Guild members pay only <strong>{(TRADING_CONSTANTS.guildMemberTaxDiscount * 100).toFixed(0)}%</strong> of normal taxes — a{' '}
            <strong>25% discount</strong>. Join a guild early to save significant gold on every trade.
          </p>
        </div>
      </section>

      {/* Tax System */}
      <section id="taxes" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">2. Tax System</h2>
        <p className="text-foreground-secondary mb-4">
          Every player-to-player transaction incurs a tax. The base rates are:
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-2 pr-6 font-semibold text-foreground">Item Type</th>
                <th className="pb-2 pr-6 font-semibold text-foreground">Base Tax</th>
                <th className="pb-2 pr-6 font-semibold text-foreground">Guild Rate</th>
                <th className="pb-2 font-semibold text-foreground">Enemy Faction Rate</th>
              </tr>
            </thead>
            <tbody className="text-foreground-secondary">
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-6">Standard items</td>
                <td className="py-2 pr-6">7%</td>
                <td className="py-2 pr-6 text-green-400">5.25%</td>
                <td className="py-2 text-red-400">14%</td>
              </tr>
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-6">Rare items (Marks, Escudo, Pearl…)</td>
                <td className="py-2 pr-6">12%</td>
                <td className="py-2 pr-6 text-green-400">9%</td>
                <td className="py-2 text-red-400">24%</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">Unavailable cannons</td>
                <td className="py-2 pr-6">10%</td>
                <td className="py-2 pr-6 text-green-400">7.5%</td>
                <td className="py-2 text-red-400">20%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm font-semibold text-red-400 mb-1">Warning: Enemy Faction Penalty</p>
          <p className="text-sm text-foreground-secondary">
            Trading in <strong>enemy faction ports</strong> applies a <strong>2× tax multiplier</strong>. Standard 7% becomes 14%; rare items go from 12% to 24%. This makes cross-faction trading expensive — plan your routes to stay in friendly or neutral ports.
          </p>
        </div>

        <p className="text-sm text-foreground-secondary mb-3">
          High-tax items (always at the rare rate of 12%):
        </p>
        <div className="flex flex-wrap gap-2">
          {HIGH_TAX_ITEMS.map(item => (
            <span key={item} className="text-xs px-2.5 py-1 bg-surface border border-surface-border rounded-md text-foreground-secondary">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Price Ranges */}
      <section id="price-ranges" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">3. Price Ranges</h2>
        <p className="text-foreground-secondary mb-4">
          Player trade orders must fall within price multiplier limits relative to the item&apos;s base value. This prevents extreme price manipulation while still allowing market dynamics.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-2 pr-6 font-semibold text-foreground">Category</th>
                <th className="pb-2 pr-6 font-semibold text-foreground">Min Price</th>
                <th className="pb-2 pr-6 font-semibold text-foreground">Max Price</th>
                <th className="pb-2 font-semibold text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="text-foreground-secondary">
              {TRADE_PRICE_RANGES.map(r => (
                <tr key={r.type} className="border-b border-surface-border/50">
                  <td className="py-2 pr-6 font-medium text-foreground">{r.type}</td>
                  <td className="py-2 pr-6 text-green-400">{r.min}</td>
                  <td className="py-2 pr-6 text-red-400">{r.max}</td>
                  <td className="py-2 text-foreground-muted text-xs">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-foreground-muted mt-3">
          Multipliers are relative to the item&apos;s medium cost. Gems have the widest spread (up to 1000×) — prices are almost entirely market-driven.
        </p>
      </section>

      {/* Port Resources */}
      <section id="port-resources" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">4. Port Resources</h2>
        <p className="text-foreground-secondary mb-4">
          Each port type stocks different base resources. All ports stock <strong>Wood</strong> and <strong>Resin</strong>. Beyond that, availability depends on port type:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {Object.entries(PORT_RESOURCES).map(([type, resources]) => (
            <div key={type} className="bg-surface border border-surface-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">
                {type === 'allPorts' ? '🌍 All Ports' :
                 type === 'PirateBay' ? '☠️ Pirate Bay' :
                 type === 'City' ? '🏙️ City' :
                 type === 'Bay' ? '⚓ Bay' : '🏝️ Neutral Bay'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {resources.map(r => (
                  <span key={r} className="text-xs px-2 py-0.5 bg-surface-hover border border-surface-border rounded text-foreground-secondary">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground-secondary">
          See <WikiLink href="/wiki/resources">Resources</WikiLink> for the full catalog of 68 resources with values and weights, and <WikiLink href="/wiki/ports">Ports</WikiLink> for port locations and ownership.
        </p>
      </section>

      {/* Port Bonuses */}
      <section id="port-bonuses" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">5. Port Bonuses by Level</h2>
        <p className="text-foreground-secondary mb-4">
          Ports level up from 1 to 7 as the owning faction develops them. Higher-level ports unlock powerful bonuses for allied players — from resource production to crafting discounts. Who benefits depends on your relationship to the port owner.
        </p>

        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          {['Nation (owner + allies)', 'Trader HQ (trade post holders)', 'Pirate owners'].map(r => (
            <span key={r} className="px-2.5 py-1 bg-surface border border-surface-border rounded-md text-foreground-secondary">
              {r}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-2 pr-3 font-semibold text-foreground">Bonus</th>
                <th className="pb-2 pr-3 font-semibold text-foreground text-xs">Who</th>
                {[1,2,3,4,5,6,7].map(lvl => (
                  <th key={lvl} className="pb-2 px-2 font-semibold text-foreground text-center w-10">L{lvl}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-foreground-secondary">
              {PORT_BONUSES.map(bonus => (
                <tr key={bonus.type} className="border-b border-surface-border/50">
                  <td className="py-2 pr-3 text-sm text-foreground">{bonus.type}</td>
                  <td className="py-2 pr-3 text-xs text-foreground-muted whitespace-nowrap">{bonus.receiver}</td>
                  {bonus.values.map((val, i) => (
                    <td key={i} className={`py-2 px-2 text-center font-mono text-xs ${
                      val > 0 ? 'text-accent' : 'text-foreground-muted'
                    }`}>
                      {val}{bonus.unit === '%' || bonus.unit === 'lots' || bonus.unit === 'crew' ? '' : ''}
                      {val > 0 && bonus.unit !== 'units/cycle' && bonus.unit !== 'crew' && bonus.unit !== 'lots' ? '%' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-foreground-muted mt-3">
          Port level bonuses are cumulative — a Level 7 port gives the maximum value. Some bonuses (like AllPortsAuction) unlock as on/off at certain levels rather than scaling.
        </p>

        <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
          <p className="text-sm font-semibold text-amber-400 mb-1">Tip: Trade HQ Bonuses</p>
          <p className="text-sm text-foreground-secondary">
            Setting up a <strong>Trade HQ</strong> in a high-level port unlocks ship craft discounts (up to 12%), weapon craft discounts (up to 25%), and faster crafting times. The investment pays off quickly if you craft ships or weapons regularly.
          </p>
        </div>
      </section>

      {/* Crafting Overview */}
      <section id="crafting" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">6. Crafting Overview</h2>
        <p className="text-foreground-secondary mb-4">
          Crafting is how you produce ships, weapons, ammunition, and consumables. Most endgame content requires crafted materials. The crafting system has three main facilities:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {[
            { name: '⚒️ Workshop', desc: 'Craft basic components: Bulkhead, Beam, Plate, and cannon parts. Also smelt Iron from ore. The foundation of all production.' },
            { name: '🔥 Furnace', desc: 'Smelt refined metals like Bronze and process advanced materials. Required for high-tier weapon and ship crafting.' },
            { name: '🏭 Factory', desc: 'Mass-produce resources and components. Higher port level = faster factory mining speed (up to +25%).' },
          ].map(f => (
            <div key={f.name} className="bg-surface border border-surface-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">{f.name}</p>
              <p className="text-sm text-foreground-secondary">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-foreground-secondary mb-3">
          Ship crafting requires <strong>Bulkhead</strong>, <strong>Beam</strong>, <strong>Plate</strong>, and <strong>Battle Marks</strong> (earned from PvP). Some ships also need a <strong>Construction License</strong>. Rate I ships are expensive — plan your resource pipeline carefully.
        </p>

        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-2">Example: 12 Apostolov (Rate I Heavy)</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { mat: 'Bulkhead', qty: '1,500' },
              { mat: 'Beam', qty: '1,130' },
              { mat: 'Plate', qty: '90' },
              { mat: 'Battle Mark', qty: '945' },
              { mat: 'Construction License', qty: '1' },
            ].map(m => (
              <div key={m.mat} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-hover border border-surface-border rounded-md">
                <span className="text-foreground font-medium">{m.qty}</span>
                <span className="text-foreground-muted">×</span>
                <span className="text-foreground-secondary">{m.mat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-foreground-secondary">
          Full recipes and details on the <WikiLink href="/wiki/crafting">Crafting</WikiLink> page. Use the interactive <WikiLink href="/wiki/tools/crafting-calculator">Crafting Calculator</WikiLink> to plan your material needs.
        </p>
      </section>

      {/* Pirate Economy */}
      <section id="pirate-economy" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">7. Pirate Economy</h2>
        <p className="text-foreground-secondary mb-4">
          Pirates have a unique economic niche. While they face restrictions (no Trade HQ, double taxes in enemy ports), pirate-controlled ports offer exclusive advantages:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: '⚒️ Pirate Port Crafting', desc: 'Pirate bays sell key crafting materials: Ice Blocks, Plate, Beam, Bronze, Provisions, Bulkhead, and Canvas. Essential supply chain for non-pirate players too.' },
            { name: '💀 Pirate Trader', desc: 'Exchange Escudo for rare items: Treasure Maps, Voodoo Skulls, Imperial Legend currency, and exclusive ship designs. 26 offers refreshable for 4 Escudo.' },
            { name: '⚡ Powerup Discounts', desc: 'Pirate ports offer up to 40% discount on powerup (consumable) crafting at Level 7 — the best consumable crafting rate in the game.' },
            { name: '🚢 Decraft Bonus', desc: 'Ships deconstructed in pirate ports return up to 35% more materials at Level 7. Efficient for recycling captured ships.' },
          ].map(f => (
            <div key={f.name} className="bg-surface border border-surface-border rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">{f.name}</p>
              <p className="text-sm text-foreground-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SeeAlso items={[
        { title: '💎 Resources', href: '/wiki/resources', description: 'All 68 resources — values, weights, and uses' },
        { title: '💰 Trading', href: '/wiki/trading', description: 'Trade goods, margins, and profit rankings' },
        { title: '🔨 Crafting', href: '/wiki/crafting', description: 'Recipes for ships, weapons, and items' },
        { title: '⚓ Ports', href: '/wiki/ports', description: 'Port locations, types, and ownership' },
        { title: '⚜️ Guilds', href: '/wiki/guilds', description: 'Guild economy and port control' },
        { title: '🔧 Crafting Calculator', href: '/wiki/tools/crafting-calculator', description: 'Plan material requirements interactively' },
      ]} />
      <NavBox
        category="World & Economy"
        icon="🌍"
        items={[
          { label: 'Economy Guide', href: '/wiki/economy' },
          { label: 'Trading', href: '/wiki/trading' },
          { label: 'Resources', href: '/wiki/resources' },
          { label: 'Ports', href: '/wiki/ports' },
          { label: 'Crafting', href: '/wiki/crafting' },
        ]}
      />
    </main>
  )
}
