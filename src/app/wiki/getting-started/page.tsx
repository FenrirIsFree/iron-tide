import Link from 'next/link'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import WikiLink from '@/components/wiki/WikiLink'

export const metadata = {
  title: 'Getting Started — The Iron Tide Wiki',
  description: 'Your first hour in World of Sea Battle — your first ship, basic combat, earning gold, joining a guild, and where to go next.',
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 border-l-4 border-amber-500 bg-amber-500/10 rounded-r-lg px-4 py-3">
      <p className="text-sm font-semibold text-amber-400 mb-1">Tip</p>
      <div className="text-sm text-foreground-secondary">{children}</div>
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 border-l-4 border-red-500 bg-red-500/10 rounded-r-lg px-4 py-3">
      <p className="text-sm font-semibold text-red-400 mb-1">Warning</p>
      <div className="text-sm text-foreground-secondary">{children}</div>
    </div>
  )
}

export default function GettingStartedPage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-5xl mx-auto w-full">
      <WikiBreadcrumb current="Getting Started" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">🚀 Your First Hour in World of Sea Battle</h1>
        <p className="text-foreground-secondary mt-1">
          Everything you need to go from fresh captain to your first real battle
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-8 bg-surface border border-surface-border rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-3">Contents</p>
        <ol className="space-y-1 text-sm text-accent">
          <li><a href="#what-is-wosb" className="hover:underline">1. What is World of Sea Battle?</a></li>
          <li><a href="#factions" className="hover:underline">2. Factions & Guilds</a></li>
          <li><a href="#first-ship" className="hover:underline">3. Your First Ship</a></li>
          <li><a href="#controls" className="hover:underline">4. Controls & Navigation</a></li>
          <li><a href="#first-battle" className="hover:underline">5. Your First Battle</a></li>
          <li><a href="#ship-tree" className="hover:underline">6. The Ship Class Tree</a></li>
          <li><a href="#making-money" className="hover:underline">7. Making Money</a></li>
          <li><a href="#guilds" className="hover:underline">8. Guilds</a></li>
          <li><a href="#next-steps" className="hover:underline">9. Next Steps</a></li>
        </ol>
      </div>

      {/* Section 1 */}
      <section id="what-is-wosb" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">1. What is World of Sea Battle?</h2>
        <p className="text-foreground-secondary mb-3">
          World of Sea Battle (WoSB) is a naval action MMO set in a fantasy version of the Age of Sail. You command historical and fictional warships, fight other players and NPCs, trade resources between ports, and compete for control of the seas with your faction.
        </p>
        <p className="text-foreground-secondary mb-3">
          Unlike many MMOs, WoSB rewards skill heavily. <WikiLink href="/wiki/combat">Combat</WikiLink> is physics-based — the angle you present to enemy fire matters as much as your ship&apos;s armor rating. A skilled captain in a Rate V ship can defeat a careless player in a Rate I.
        </p>
        <p className="text-foreground-secondary">
          The game is built around three loops: <strong>combat</strong> to earn Battle Marks and XP, <strong>trading and crafting</strong> to fund your ships, and <strong>faction warfare</strong> to fight over ports with your guild.
        </p>
      </section>

      {/* Section 2 */}
      <section id="factions" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">2. Factions & Guilds</h2>
        <p className="text-foreground-secondary mb-3">
          You <strong className="text-foreground">don&apos;t choose a faction</strong> when you start the game — every new player begins as <strong className="text-foreground">neutral</strong>. Your faction is determined by the guild you join. When you join a guild, you automatically take on that guild&apos;s faction. Leave the guild, and you go back to neutral.
        </p>
        <p className="text-foreground-secondary mb-4">
          There are three military factions (<WikiLink href="/wiki/factions">Antilia, Espaniol, and Kai & Severia</WikiLink>), plus the <strong className="text-foreground">Trade Union</strong> (merchants) and <strong className="text-foreground">Pirates</strong>. See the <WikiLink href="/wiki/factions">Faction Guide</WikiLink> for full details on each.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Antilia', icon: '🏴', desc: 'Balanced fleet with strong Rate I ships like Victory. Good all-rounder — recommended for new players.', tag: 'Military faction' },
            { name: 'Espaniol', icon: '⚜️', desc: 'Heavy firepower and large ships like the Santisima Trinidad. Great for combat-focused players.', tag: 'Military faction' },
            { name: 'Kai & Severia', icon: '🌅', desc: 'Eastern/Northern union. Strong crafting economy with ships like the 12 Apostolov.', tag: 'Military faction' },
            { name: 'Trade Union', icon: '💰', desc: 'Neutral to military factions. Focus on trading and economy. Contest Caliphate ports.', tag: 'Merchant faction' },
            { name: 'Pirates', icon: '☠️', desc: 'Hostile to everyone. Exclusive pirate coves and special trader. For experienced players.', tag: 'Outlaw faction' },
          ].map(f => (
            <div key={f.name} className="bg-surface border border-surface-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{f.name}</p>
                  <p className="text-xs text-accent">{f.tag}</p>
                </div>
              </div>
              <p className="text-sm text-foreground-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
        <Tip>
          As a new player, focus on learning the game first — you can play without a faction. When you&apos;re ready, find a guild that matches your play style. If you&apos;re playing with friends, join the same guild so you&apos;re on the same side.
        </Tip>
        <Warning>
          Your faction affects which ports are safe, who attacks you on sight, and crafting bonuses. The military factions are at war with each other, so choose your guild carefully.
        </Warning>
      </section>

      {/* Section 3 */}
      <section id="first-ship" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">3. Your First Ship</h2>
        <p className="text-foreground-secondary mb-3">
          Every new captain starts with two free <strong>Rate VII</strong> ships — the <WikiLink href="/wiki/ships/pickle">Pickle</WikiLink> (Fast class) and the <WikiLink href="/wiki/ships/friede">Friede</WikiLink> (Fast class). These are the lowest tier, but solid learning tools. Rate VII ships are fast, nimble, and cheap to repair, making mistakes much less painful.
        </p>
        <p className="text-foreground-secondary mb-3">
          Ships in WoSB are organized by <strong>Rate</strong> (VII being the weakest, I the strongest) and <strong>Class</strong>. There are five classes:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-2 pr-4 font-semibold text-foreground">Class</th>
                <th className="pb-2 pr-4 font-semibold text-foreground">Role</th>
                <th className="pb-2 font-semibold text-foreground">Best for</th>
              </tr>
            </thead>
            <tbody className="text-foreground-secondary">
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-4">⚔️ Battle (Battleship)</td>
                <td className="py-2 pr-4">Mobile combat</td>
                <td className="py-2">PvP, nimble fighting</td>
              </tr>
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-4">🛡️ Heavy (Hardship)</td>
                <td className="py-2 pr-4">Tank & broadside</td>
                <td className="py-2">Durability, high damage</td>
              </tr>
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-4">📦 Transport (CargoShip)</td>
                <td className="py-2 pr-4">Cargo hauling</td>
                <td className="py-2">Trading, economy</td>
              </tr>
              <tr className="border-b border-surface-border/50">
                <td className="py-2 pr-4">💨 Fast (Destroyer)</td>
                <td className="py-2 pr-4">Speed & raiding</td>
                <td className="py-2">Hit-and-run, intercepting</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">💣 Siege (Mortar)</td>
                <td className="py-2 pr-4">Mortar bombardment</td>
                <td className="py-2">Fort sieges, area damage</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Tip>
          Start with a <strong>Battle class</strong> ship if you want to focus on PvP from the beginning. The Battle tree teaches you positioning and aim, which transfers to every other class.
        </Tip>
        <p className="text-foreground-secondary">
          Browse all ships in the <WikiLink href="/wiki/ships">Ship Database</WikiLink> or see how each class progresses in the <WikiLink href="/wiki/ships/classes">Ship Class Trees</WikiLink>.
        </p>
      </section>

      {/* Section 4 */}
      <section id="controls" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">4. Controls & Navigation</h2>
        <p className="text-foreground-secondary mb-3">
          WoSB uses a point-and-click movement system on the world map and direct keyboard control in battle. Here are the fundamentals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            { key: 'W / S', action: 'Increase / decrease sail speed' },
            { key: 'A / D', action: 'Turn left / right' },
            { key: 'Spacebar', action: 'Fire cannons (broadside)' },
            { key: 'Q / E', action: 'Fire port / starboard side' },
            { key: 'R', action: 'Repair sails' },
            { key: 'T', action: 'Target nearest enemy' },
            { key: 'M', action: 'Open map' },
            { key: 'B', action: 'Boarding action (close range)' },
          ].map(k => (
            <div key={k.key} className="flex items-center gap-3 bg-surface border border-surface-border rounded-md px-3 py-2">
              <kbd className="bg-surface-hover border border-surface-border rounded px-2 py-0.5 text-xs font-mono text-foreground font-semibold min-w-[56px] text-center">{k.key}</kbd>
              <span className="text-sm text-foreground-secondary">{k.action}</span>
            </div>
          ))}
        </div>
        <Tip>
          Wind direction matters. Sailing with the wind (downwind) is fastest; sailing into the wind (upwind) slows you down dramatically. Learn to read the wind rose on your HUD — it can save your life when retreating.
        </Tip>
      </section>

      {/* Section 5 */}
      <section id="first-battle" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">5. Your First Battle</h2>
        <p className="text-foreground-secondary mb-3">
          Before you engage another player, learn the damage system — it&apos;s more nuanced than it looks.
        </p>
        <p className="text-foreground-secondary mb-3">
          Damage in WoSB uses a <strong>Penetration vs Armor</strong> model:
        </p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4 font-mono text-sm">
          <p className="text-foreground">Damage = max(0, Penetration − EffectiveArmor) × Ammo Factor</p>
          <p className="text-foreground-muted mt-2 text-xs font-sans">If your cannon&apos;s penetration doesn&apos;t exceed the target&apos;s armor, you deal zero damage.</p>
        </div>
        <p className="text-foreground-secondary mb-3">
          The angle you hit matters enormously. A broadside hit (flat angle) deals full damage. An angled shot can deal only 30% of the same broadside damage. Always try to present your <strong>broadside</strong> to the enemy while angling your own hull to reduce incoming damage.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { zone: 'Broadside', icon: '⚔️', effect: 'Full damage — the primary target zone', color: 'border-red-500/50' },
            { zone: 'Bow (front)', icon: '🛡️', effect: 'Reduced damage — angled hull is thicker', color: 'border-amber-500/50' },
            { zone: 'Stern (back)', icon: '💀', effect: 'Lowest armor — vulnerable weak point', color: 'border-red-500/50' },
          ].map(z => (
            <div key={z.zone} className={`bg-surface border ${z.color} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{z.icon}</span>
                <span className="font-semibold text-foreground text-sm">{z.zone}</span>
              </div>
              <p className="text-xs text-foreground-secondary">{z.effect}</p>
            </div>
          ))}
        </div>
        <Warning>
          If your ship starts flooding, you&apos;re going down — there&apos;s no way to repair out of it. Avoid taking critical hits to the stern and watch your hull integrity.
        </Warning>
        <Tip>
          For your first battles, fight NPC ships (pirates or merchant convoys) to earn XP and gold without risking PvP. They follow predictable patterns and won&apos;t punish positioning mistakes as harshly.
        </Tip>
        <p className="text-foreground-secondary">
          Deep dive into combat mechanics in the <WikiLink href="/wiki/combat">Combat Guide</WikiLink> and <WikiLink href="/wiki/pvp">PvP Guide</WikiLink>.
        </p>
      </section>

      {/* Section 6 */}
      <section id="ship-tree" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">6. The Ship Class Tree</h2>
        <p className="text-foreground-secondary mb-3">
          To unlock better ships, you research your class tree by earning <strong>Ship XP</strong> by doing quests, fighting NPC and player ships, etc. Play a Combat ship to earn Combat class XP; play a Heavy ship to earn Heavy class XP. Each class has a separate progression from Rate VII to Rate I.
        </p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              { rate: 'VII', xp: 'Free', note: 'Starter' },
              { rate: 'VI', xp: '800 XP', note: '' },
              { rate: 'V', xp: '4,500 XP', note: '' },
              { rate: 'IV', xp: '14,000 XP', note: '' },
              { rate: 'III', xp: '25,000 XP', note: '' },
              { rate: 'II', xp: '50,000 XP', note: '' },
              { rate: 'I', xp: '70,000 XP', note: 'Max tier' },
            ].map((r, i) => (
              <div key={r.rate} className="flex items-center gap-1.5">
                <span className="px-2 py-1 bg-surface-hover border border-surface-border rounded text-foreground font-mono text-xs font-semibold">Rate {r.rate}</span>
                {i < 6 && <span className="text-foreground-muted text-xs">{r.xp} →</span>}
                {i === 6 && <span className="text-accent text-xs font-semibold">{r.xp}</span>}
              </div>
            ))}
          </div>
        </div>
        <Tip>
          Fill all upgrade slots on your ship to earn XP at 100% efficiency. An empty slot means reduced XP gain. Research multiple class trees simultaneously — the game gives bonus XP to other trees the more branches you&apos;ve completed.
        </Tip>
        <p className="text-foreground-secondary">
          See the full visual progression in <WikiLink href="/wiki/ships/classes">Ship Class Trees</WikiLink>.
        </p>
      </section>

      {/* Section 7 */}
      <section id="making-money" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">7. Making Money</h2>
        <p className="text-foreground-secondary mb-3">
          Gold is the lifeblood of WoSB. You need it for repairs, crafting materials, and trading. Here are the three main income sources for new players:
        </p>
        <div className="space-y-3 mb-4">
          {[
            {
              method: '⚔️ PvE Combat',
              desc: 'Fight NPC ships and bosses to earn gold, Battle Marks, and XP. NPC bosses drop the best loot. Safe and consistent income.',
              level: 'Beginner',
              color: 'border-green-500/50',
            },
            {
              method: '💰 Trading',
              desc: 'Buy resources cheap at one port and sell high at another. With a Transport ship, you can haul large quantities. The pirate-held economy has different supply and demand — high risk, high reward.',
              level: 'Intermediate',
              color: 'border-amber-500/50',
            },
            {
              method: '🔨 Crafting & Selling',
              desc: 'Craft ships, weapons, or consumables and sell them at the auction. Requires investment in factories and blueprints, but profit margins can be large.',
              level: 'Advanced',
              color: 'border-blue-500/50',
            },
          ].map(m => (
            <div key={m.method} className={`bg-surface border ${m.color} rounded-lg p-4`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-foreground text-sm">{m.method}</p>
                <span className="text-xs text-foreground-muted flex-shrink-0">{m.level}</span>
              </div>
              <p className="text-sm text-foreground-secondary">{m.desc}</p>
            </div>
          ))}
        </div>
        <Warning>
          Don&apos;t spend all your gold on a ship you can&apos;t yet handle. A ship you can&apos;t repair is a ship stuck in port. Keep at least enough gold for 3–5 full repairs before upgrading.
        </Warning>
        <p className="text-foreground-secondary">
          Learn the full trading system in the <WikiLink href="/wiki/economy">Economy Guide</WikiLink> and <WikiLink href="/wiki/trading">Trading</WikiLink> page.
        </p>
      </section>

      {/* Section 8 */}
      <section id="guilds" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">8. Guilds</h2>
        <p className="text-foreground-secondary mb-3">
          Guilds are the backbone of WoSB&apos;s faction warfare. A guild can own ports, declare war on other guilds, and coordinate fleet battles. Guild membership also provides a <strong>25% tax discount</strong> on player-to-player trades.
        </p>
        <Tip>
          Find a guild early. Solo play is viable for PvE and trading, but ports are contested by guilds, and the best loot from port battles requires organized fleet action. Many guilds actively recruit new players and will help you get up to speed.
        </Tip>
        <p className="text-foreground-secondary">
          Full details on the <WikiLink href="/wiki/guilds">Guilds</WikiLink> page.
        </p>
      </section>

      {/* Section 9 */}
      <section id="next-steps" className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-3">9. Next Steps</h2>
        <p className="text-foreground-secondary mb-3">
          Once you&apos;ve got your footing, here&apos;s a suggested progression path:
        </p>
        <ol className="space-y-3">
          {[
            { step: 'Reach Rank 5', desc: 'Unlocks Captain Skills and lets you join most guilds. Focus on PvE battles and quests for fast XP.', link: '/wiki/ranks', linkText: 'Ranks →' },
            { step: 'Research Rate V in your class', desc: 'Rate V ships are where the game opens up. More upgrade slots, meaningful stats, and access to most PvP content.', link: '/wiki/ships/classes', linkText: 'Class Trees →' },
          ].map((s, i) => (
            <li key={i} className="flex gap-4 bg-surface border border-surface-border rounded-lg p-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground text-sm">{s.step}</p>
                  <Link href={s.link} className="text-xs text-accent hover:underline flex-shrink-0">{s.linkText}</Link>
                </div>
                <p className="text-sm text-foreground-secondary mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <SeeAlso items={[
        { title: '🏴 Faction Guide', href: '/wiki/factions', description: 'All factions — diplomacy, ports, ships, and lore' },
        { title: '🚢 Ship Database', href: '/wiki/ships', description: 'Browse all 62 ships with full stats' },
        { title: '🌳 Ship Class Trees', href: '/wiki/ships/classes', description: 'Visual progression from Rate VII to Rate I' },
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Master damage formulas and armor angles' },
        { title: '⚔️ PvP Guide', href: '/wiki/pvp', description: 'Tactics, weapon selection, and boarding' },
        { title: '💰 Economy Guide', href: '/wiki/economy', description: 'Trading, crafting, and port bonuses' },
      ]} />
      <NavBox
        category="Getting Started"
        icon="🚀"
        items={[
          { label: 'Getting Started', href: '/wiki/getting-started' },
          { label: 'Faction Guide', href: '/wiki/factions' },
          { label: 'Ship Database', href: '/wiki/ships' },
          { label: 'Ship Class Trees', href: '/wiki/ships/classes' },
          { label: 'Combat Guide', href: '/wiki/combat' },
          { label: 'Captain Skills', href: '/wiki/skills' },
        ]}
      />
    </main>
  )
}
