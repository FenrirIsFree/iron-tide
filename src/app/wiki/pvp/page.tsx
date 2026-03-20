import Link from 'next/link'
import WikiBreadcrumb from '@/components/WikiBreadcrumb'
import SeeAlso from '@/components/wiki/SeeAlso'
import NavBox from '@/components/wiki/NavBox'
import WikiLink from '@/components/wiki/WikiLink'

export const metadata = {
  title: 'PvP Guide — The Iron Tide Wiki',
  description: 'World of Sea Battle PvP guide — combat tactics, weapon selection, armor angles, boarding, arena mode, and open-world PvP strategies.',
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 border-l-4 border-amber-500 bg-amber-500/10 rounded-r-lg px-4 py-3">
      <p className="text-sm font-semibold text-amber-400 mb-1">💡 Tip</p>
      <div className="text-sm text-foreground-secondary">{children}</div>
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 border-l-4 border-red-500 bg-red-500/10 rounded-r-lg px-4 py-3">
      <p className="text-sm font-semibold text-red-400 mb-1">⚠️ Warning</p>
      <div className="text-sm text-foreground-secondary">{children}</div>
    </div>
  )
}

export default function PvPGuidePage() {
  return (
    <main className="flex-1 pt-8 pb-12 px-4 max-w-4xl mx-auto w-full">
      <WikiBreadcrumb current="PvP Guide" />

      <h1 className="text-3xl font-bold text-foreground mb-2">⚔️ PvP Guide</h1>
      <p className="text-foreground-secondary mb-8">
        Everything you need to know about player-versus-player combat in World of Sea Battle — from your first
        skirmish to dominating the Arena.
      </p>

      {/* PvP Modes */}
      <section className="mb-10">
        <h2 id="pvp-modes" className="text-xl font-bold text-foreground mb-3">🏴 PvP Modes</h2>
        <p className="text-foreground-secondary mb-4">
          WoSB has several ways to fight other players, each with different rules and rewards.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-base font-semibold text-foreground mb-2">🌊 Open-World PvP</h3>
            <p className="text-sm text-foreground-secondary">
              Sail the open seas and engage other players. PvP flags determine who you can attack and who can attack you.
              Risk losing cargo on defeat, but earn <WikiLink href="/wiki/resources">Battle Marks</WikiLink> and loot from victories.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-base font-semibold text-foreground mb-2">🏟️ Arena</h3>
            <p className="text-sm text-foreground-secondary">
              Structured PvP with <WikiLink href="/wiki/arena">random upgrades and ranked seasons</WikiLink>.
              No cargo risk — pure combat skill. Earn exclusive rewards and climb the leaderboard.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-base font-semibold text-foreground mb-2">⚔️ Guild Wars</h3>
            <p className="text-sm text-foreground-secondary">
              <WikiLink href="/wiki/guilds">Guild-based</WikiLink> territory control and port battles.
              Coordinate with your guild to capture and defend strategic ports.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <h3 className="text-base font-semibold text-foreground mb-2">🏴‍☠️ Pirate Mode</h3>
            <p className="text-sm text-foreground-secondary">
              Go rogue — attack anyone regardless of faction. Higher rewards but everyone becomes your enemy.
              Captured pirates face penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Combat Tactics */}
      <section className="mb-10">
        <h2 id="combat-tactics" className="text-xl font-bold text-foreground mb-3">🎯 Combat Tactics</h2>

        <h3 id="positioning" className="text-lg font-semibold text-foreground mt-6 mb-2">Positioning & Angling</h3>
        <p className="text-foreground-secondary mb-3">
          The single most important skill in PvP is controlling your angle relative to the enemy. The{' '}
          <WikiLink href="/wiki/combat">damage formula</WikiLink> heavily penalizes shots that hit at steep angles.
        </p>
        <ul className="list-disc list-inside text-foreground-secondary space-y-2 mb-4">
          <li><span className="text-green-400 font-medium">Broadside (0°)</span> — Full damage. Always try to present your broadside to fire, while angling away from incoming fire.</li>
          <li><span className="text-amber-400 font-medium">45° angle</span> — Roughly 65% damage. A good defensive angle that still lets you return fire.</li>
          <li><span className="text-red-400 font-medium">Bow/Stern (90°)</span> — Only ~30% damage. Angle your ship to take hits on the bow when under fire.</li>
        </ul>

        <Tip>
          Use the <WikiLink href="/wiki/tools/damage-calculator">Damage Calculator</WikiLink> to see exactly how angle affects
          damage for specific weapon and armor combinations.
        </Tip>

        <h3 id="ship-classes" className="text-lg font-semibold text-foreground mt-6 mb-2">Ship Class Tactics</h3>
        <div className="space-y-3 mb-4">
          <div className="bg-surface border border-surface-border rounded-lg p-3">
            <p className="text-sm"><span className="text-accent font-semibold">⚔️ Battle Ships</span> — The frontline brawlers.
              High armor, massive broadside firepower. Sail straight into the fight and trade volleys.
              Weakness: slow speed and mobility make you vulnerable to flanking.</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-3">
            <p className="text-sm"><span className="text-accent font-semibold">🛡️ Heavy Ships</span> — Tanky damage sponges.
              Excellent armor and HP but lower DPS. Use them to absorb fire and protect lighter ships.
              Best in group fights where they can draw aggro.</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-3">
            <p className="text-sm"><span className="text-accent font-semibold">🚚 Transport Ships</span> — Don&apos;t underestimate them.
              Huge hold capacity means they can carry massive amounts of repair supplies.
              Some transports have surprisingly good weapon slots.</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-3">
            <p className="text-sm"><span className="text-accent font-semibold">⚡ Fast Ships</span> — Hit and run specialists.
              High speed lets you choose engagements. Circle slower ships and pound their stern.
              Weakness: low HP and armor mean a few good broadsides can end you.</p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-3">
            <p className="text-sm"><span className="text-accent font-semibold">💣 Siege Ships</span> — Long-range artillery.
              <WikiLink href="/wiki/weapons">Mortars</WikiLink> ignore armor angles entirely — damage is consistent regardless of positioning.
              Stay at range, rain fire, and let your team handle close combat.</p>
          </div>
        </div>
      </section>

      {/* Weapon Selection */}
      <section className="mb-10">
        <h2 id="weapon-selection" className="text-xl font-bold text-foreground mb-3">🔫 Weapon Selection for PvP</h2>
        <p className="text-foreground-secondary mb-4">
          Choosing the right <WikiLink href="/wiki/weapons">weapons</WikiLink> and{' '}
          <WikiLink href="/wiki/ammo">ammunition</WikiLink> can make or break a fight.
        </p>

        <div className="overflow-x-auto mb-4">
          <div className="space-y-2">
            <div className="bg-surface border border-surface-border rounded-lg p-3">
              <p className="text-sm"><span className="text-foreground font-semibold">Cannons</span> — Balanced damage and range.
                Best all-around choice for PvP. Long Cannons sacrifice reload speed for extra range.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-lg p-3">
              <p className="text-sm"><span className="text-foreground font-semibold">Carronades</span> — Short range, devastating damage.
                Perfect for close-quarters brawling. If you can close the distance, nothing hits harder per volley.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-lg p-3">
              <p className="text-sm"><span className="text-foreground font-semibold">Mortars</span> — Ignore armor angles entirely.
                Consistent damage at any angle, but slower reload and require range management (min range applies).</p>
            </div>
          </div>
        </div>

        <h3 id="ammo-choice" className="text-lg font-semibold text-foreground mt-6 mb-2">Ammo Selection</h3>
        <p className="text-foreground-secondary mb-3">
          Different <WikiLink href="/wiki/ammo">ammo types</WikiLink> serve different tactical purposes:
        </p>
        <ul className="list-disc list-inside text-foreground-secondary space-y-2 mb-4">
          <li><span className="font-medium text-foreground">Round Shot</span> — Standard hull damage. Your bread and butter.</li>
          <li><span className="font-medium text-foreground">Chain Shot</span> — Sail damage to slow enemies. Use early to prevent escape.</li>
          <li><span className="font-medium text-foreground">Grapeshot</span> — Crew damage for boarding prep. Switch to this before attempting a board.</li>
          <li><span className="font-medium text-foreground">Heated Shot</span> — Sets fires. Great for sustained damage over time, especially against ships with poor fire resistance.</li>
        </ul>

        <Tip>
          In a 1v1, open with Chain Shot to cripple their sails, switch to Round Shot for hull damage, then finish with
          Grapeshot + boarding if they&apos;re low on crew.
        </Tip>
      </section>

      {/* Boarding */}
      <section className="mb-10">
        <h2 id="boarding" className="text-xl font-bold text-foreground mb-3">🏴‍☠️ Boarding Mechanics</h2>
        <p className="text-foreground-secondary mb-4">
          Boarding is a high-risk, high-reward way to end a fight. Get close enough and you can send your{' '}
          <WikiLink href="/wiki/crew">crew</WikiLink> to capture the enemy ship.
        </p>
        <ul className="list-disc list-inside text-foreground-secondary space-y-2 mb-4">
          <li>You must be within boarding range (very close) to initiate</li>
          <li>Both ships stop moving during the boarding action</li>
          <li>Crew count and quality determine the outcome</li>
          <li>Grapeshot reduces enemy crew — soften them up before boarding</li>
          <li>Some <WikiLink href="/wiki/upgrades">upgrades</WikiLink> boost boarding effectiveness</li>
          <li>Captured ships can be salvaged for resources</li>
        </ul>

        <Warning>
          Boarding while other enemies are nearby is dangerous — you&apos;re a sitting duck during the boarding action.
          Make sure you won&apos;t get sunk by a third party while your crew is fighting.
        </Warning>
      </section>

      {/* Arena */}
      <section className="mb-10">
        <h2 id="arena" className="text-xl font-bold text-foreground mb-3">🏟️ Arena PvP</h2>
        <p className="text-foreground-secondary mb-4">
          The <WikiLink href="/wiki/arena">Arena</WikiLink> is WoSB&apos;s structured PvP mode with its own progression system.
        </p>
        <ul className="list-disc list-inside text-foreground-secondary space-y-2 mb-4">
          <li>Random upgrades each match — adapt your strategy to what you&apos;re given</li>
          <li>Ranked seasons with exclusive rewards for top performers</li>
          <li>Multiple map types with different terrain and tactical considerations</li>
          <li>Team-based (typically 3v3 or 5v5) — communication and coordination matter</li>
          <li>No cargo or resource risk — purely about combat skill</li>
        </ul>

        <Tip>
          Arena is the best way to practice PvP without risking your trade goods.
          It&apos;s also a great source of <WikiLink href="/wiki/resources">Battle Marks</WikiLink>.
        </Tip>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2 id="tips" className="text-xl font-bold text-foreground mb-3">🧠 General PvP Tips</h2>
        <div className="space-y-3">
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm text-foreground-secondary">
              <span className="text-accent font-semibold">1. Know when to run.</span>{' '}
              Not every fight is winnable. If you&apos;re outmatched, angle your bow toward escape and use speed boosts.
              Losing cargo to a failed fight is worse than retreating.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm text-foreground-secondary">
              <span className="text-accent font-semibold">2. Always carry repairs.</span>{' '}
              <WikiLink href="/wiki/consumables">Repair kits</WikiLink> can turn a losing fight. Keep a stack of wooden and iron
              patches in your hold at all times.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm text-foreground-secondary">
              <span className="text-accent font-semibold">3. Watch the wind.</span>{' '}
              Wind direction affects sail speed. Fighting upwind puts you at a mobility disadvantage.
              Try to keep the wind at your back for faster repositioning.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm text-foreground-secondary">
              <span className="text-accent font-semibold">4. Use consumables aggressively.</span>{' '}
              <WikiLink href="/wiki/consumables">Smoke bombs</WikiLink>, speed boosts, and powder charges exist to be used.
              Don&apos;t hoard them — they&apos;re cheap compared to what you lose in a defeat.
            </p>
          </div>
          <div className="bg-surface border border-surface-border rounded-lg p-4">
            <p className="text-sm text-foreground-secondary">
              <span className="text-accent font-semibold">5. Study the damage formula.</span>{' '}
              Understanding how <WikiLink href="/wiki/combat">penetration, armor, and angle</WikiLink> interact
              gives you a huge edge. Know which weapons can actually hurt your target.
            </p>
          </div>
        </div>
      </section>

      <SeeAlso items={[
        { title: '⚔️ Combat Guide', href: '/wiki/combat', description: 'Damage formulas and mechanics from decompiled source' },
        { title: '🎯 Damage Calculator', href: '/wiki/tools/damage-calculator', description: 'Calculate exact damage for any weapon/ammo/angle' },
        { title: '🔫 Weapons', href: '/wiki/weapons', description: 'All weapons with stats and comparisons' },
        { title: '💣 Ammunition', href: '/wiki/ammo', description: 'Ammo types and their tactical uses' },
        { title: '🏟️ Arena', href: '/wiki/arena', description: 'Arena mode — maps, rewards, and strategy' },
        { title: '👥 Crew & Units', href: '/wiki/crew', description: 'Crew types for boarding and combat bonuses' },
      ]} />
      <NavBox
        category="Guides"
        icon="📖"
        items={[
          { label: 'Getting Started', href: '/wiki/getting-started' },
          { label: 'Faction Guide', href: '/wiki/factions' },
          { label: 'Economy Guide', href: '/wiki/economy' },
          { label: 'PvP Guide', href: '/wiki/pvp' },
          { label: 'Combat Guide', href: '/wiki/combat' },
        ]}
      />
    </main>
  )
}
