'use client'

import { useState } from 'react'

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-hover rounded-lg px-4 py-3 my-3 font-mono text-sm text-cyan-400 overflow-x-auto">
      {children}
    </div>
  )
}

function Var({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-400 font-semibold">{children}</span>
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 border-b border-surface-border pb-2">
        <span className="text-accent">{icon}</span> {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function InfoBox({ title, children, variant = 'info' }: { title?: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'tip' }) {
  const styles = {
    info: 'border-blue-800 bg-blue-900/20',
    warning: 'border-amber-800 bg-amber-900/20',
    tip: 'border-green-800 bg-green-900/20',
  }
  return (
    <div className={`border rounded-xl p-4 ${styles[variant]}`}>
      {title && <h4 className="text-foreground font-semibold text-sm mb-1">{title}</h4>}
      <div className="text-foreground-secondary text-sm">{children}</div>
    </div>
  )
}

const TOC = [
  { id: 'damage', label: 'Damage Calculation', icon: '💥' },
  { id: 'armor', label: 'Armor & Angles', icon: '🛡️' },
  { id: 'cannons', label: 'Cannon Mechanics', icon: '🔫' },
  { id: 'mortars', label: 'Mortar Mechanics', icon: '💣' },
  { id: 'fire', label: 'Fire & Burning', icon: '🔥' },
  { id: 'boarding', label: 'Boarding', icon: '🏴‍☠️' },
  { id: 'ramming', label: 'Ramming', icon: '💢' },
  { id: 'kegs', label: 'Powder Kegs', icon: '🧨' },
  { id: 'flooding', label: 'Flooding & Sinking', icon: '🌊' },
  { id: 'weather', label: 'Weather', icon: '⛈️' },
  { id: 'speed', label: 'Speed & Mobility', icon: '⛵' },
]

export default function CombatGuide() {
  const [activeSection, setActiveSection] = useState('damage')

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar TOC */}
      <nav className="lg:w-52 shrink-0">
        <div className="lg:sticky lg:top-24 flex flex-wrap lg:flex-col gap-1">
          {TOC.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
              }`}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-12">

        {/* DAMAGE */}
        <Section id="damage" title="Damage Calculation" icon="💥">
          <p className="text-foreground-secondary">
            When a cannonball hits a ship, the game applies damage through a multi-step pipeline. Understanding this pipeline is key to maximizing your damage output.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Core Damage Formula</h3>
          <Formula>
            <Var>EffectiveHP</Var> -= <Var>HealthDamage</Var> × <Var>DamageModifier</Var>
          </Formula>
          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2">
            <li><Var>HealthDamage</Var> — Raw damage from the cannonball (penetration × ammo factor × bonuses)</li>
            <li><Var>DamageModifier</Var> — Usually 1.0. On education maps: /1.5 for players, ×1.2 for PvP</li>
            <li><Var>DamageReduce</Var> — Target&apos;s damage reduction: min(99%, PReduceDamage bonus)</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">Hit Locations</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-foreground font-semibold text-sm mb-1">🎯 Broadside</h4>
              <p className="text-foreground-secondary text-xs">Full damage. Best angle for maximum penetration.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-foreground font-semibold text-sm mb-1">🔰 Bow (Nose)</h4>
              <p className="text-foreground-secondary text-xs">Reduced damage via PReduceDamageToNose. Built-in game mechanic, not just a player upgrade.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-red-400 font-semibold text-sm mb-1">⚠️ Stern</h4>
              <p className="text-foreground-secondary text-xs">Normal damage, BUT: hitting the stern of a flooding ship causes <span className="text-red-400 font-semibold">instant sink</span>.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-foreground font-semibold text-sm mb-1">⛵ Sails</h4>
              <p className="text-foreground-secondary text-xs">Drastically reduced hull damage (0.65-1.88 vs 13-19 for hull). Sail damage calculated separately.</p>
            </div>
          </div>

          <InfoBox title="From our PvP packet data" variant="tip">
            Same cannon, same target: <span className="text-accent font-mono">18.83</span> damage broadside vs <span className="text-accent font-mono">5.93</span> at extreme angle — a <span className="text-red-400 font-semibold">3.2× reduction</span> from armor angle alone.
          </InfoBox>
        </Section>

        {/* ARMOR */}
        <Section id="armor" title="Armor & Angles" icon="🛡️">
          <h3 className="text-foreground font-semibold">Armor Calculation</h3>
          <Formula>
            <Var>Armor</Var> = <Var>BasicArmor</Var> × (1 + <Var>PArmor%</Var>) + <Var>MArmor</Var>
          </Formula>
          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2">
            <li><Var>BasicArmor</Var> — Ship&apos;s base armor stat</li>
            <li><Var>PArmor%</Var> — Percentage bonus from upgrades/crew (multiplicative)</li>
            <li><Var>MArmor</Var> — Flat armor bonus from upgrades</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">Angle Multiplier</h3>
          <p className="text-foreground-secondary">
            Armor effectiveness depends on the angle of impact. Hitting a ship broadside (perpendicular) is most effective. Angled shots bounce more.
          </p>
          <Formula>
            <Var>EffectiveArmor</Var> = <Var>BaseArmor</Var> × <Var>AngleMultiplier</Var>
          </Formula>
          <div className="bg-surface border border-surface-border rounded-xl p-4 mt-2">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-foreground font-semibold">Broadside</div>
                <div className="text-green-400 font-mono text-lg">1.0×</div>
                <div className="text-foreground-muted">Full damage</div>
              </div>
              <div>
                <div className="text-foreground font-semibold">Moderate Angle</div>
                <div className="text-yellow-400 font-mono text-lg">0.6-0.7×</div>
                <div className="text-foreground-muted">Reduced</div>
              </div>
              <div>
                <div className="text-foreground font-semibold">Extreme (Bow)</div>
                <div className="text-red-400 font-mono text-lg">~0.3×</div>
                <div className="text-foreground-muted">Heavily reduced</div>
              </div>
            </div>
          </div>

          <InfoBox variant="warning" title="Stern hits don't do bonus damage">
            Common myth! Stern hits deal the same damage as broadside hits. The SternDamage flag only matters when the target is <span className="text-red-400 font-semibold">already flooding</span> — then it triggers instant destruction.
          </InfoBox>
        </Section>

        {/* CANNONS */}
        <Section id="cannons" title="Cannon Mechanics" icon="🔫">
          <h3 className="text-foreground font-semibold">Reload Time</h3>
          <p className="text-foreground-secondary">
            Reload time comes from the weapon&apos;s base stat, modified by crew efficiency and upgrades. Having too few sailors slows reloading significantly.
          </p>
          <Formula>
            <Var>CrewEfficiency</Var> = ratio + ratio × (1 - ratio) / 2 × 0.75
          </Formula>
          <p className="text-foreground-secondary">
            Where <Var>ratio</Var> = min(1, currentSailors / requiredSailors). At half crew, you&apos;re at ~84% efficiency. At quarter crew, ~56%.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Penetration</h3>
          <p className="text-foreground-secondary">
            Each cannon has a base penetration value. This is modified by ammo type and upgrades. If penetration exceeds armor, the full damage goes through. If not, damage is reduced.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Range & Accuracy</h3>
          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2">
            <li>Max range bonus capped at <span className="text-accent font-mono">+15</span></li>
            <li>Cannonball speed: <span className="text-accent font-mono">45.76</span> base units</li>
            <li>Double/Triple shot modes increase scatter</li>
            <li>Scatter can be reduced via PReduceCannonsScatter upgrades</li>
          </ul>

          <h3 className="text-foreground font-semibold mt-4">Damage Bonuses</h3>
          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2">
            <li><Var>PBallDamage</Var> — General damage increase from upgrades</li>
            <li>Below 50% HP: <Var>PDamageCannonIfStrengthBelow30P</Var> activates (last stand bonus)</li>
            <li>Front/back cannons can get <Var>PFrontAndBackCannonsAddDamage</Var></li>
          </ul>
        </Section>

        {/* MORTARS */}
        <Section id="mortars" title="Mortar Mechanics" icon="💣">
          <p className="text-foreground-secondary">
            Mortars fire in an arc and hit the deck from above. They <span className="text-accent font-semibold">ignore armor angle</span> — the plunging trajectory bypasses angled armor entirely.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Poundage by Ship Rate</h3>
          <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                  <th className="px-4 py-2 text-left">Ship Rate</th>
                  <th className="px-4 py-2 text-left">Mortar Poundage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['VII-VI', '6-pdr'],
                  ['V', '7-pdr'],
                  ['IV', '8-pdr'],
                  ['III', '9-pdr'],
                  ['II', '10-pdr'],
                  ['I', '11-pdr'],
                ].map(([rate, pound]) => (
                  <tr key={rate} className="border-b border-surface-border">
                    <td className="px-4 py-2 text-accent font-semibold">{rate}</td>
                    <td className="px-4 py-2 text-foreground-secondary">{pound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-foreground font-semibold mt-4">Splash Damage</h3>
          <Formula>
            <Var>DamageFactor</Var> = 0.1 + 0.9 × √(1 - clamp(<Var>distance</Var> / <Var>splashRadius</Var>))
          </Formula>
          <p className="text-foreground-secondary">
            Direct hit = 100% damage. Damage falls off smoothly with distance from impact point, down to 10% at splash edge.
          </p>

          <InfoBox variant="tip" title="From our PvP data">
            All mortar hits dealt a consistent <span className="text-accent font-mono">12.0</span> damage regardless of angle — confirming mortars bypass armor angle mechanics entirely.
          </InfoBox>
        </Section>

        {/* FIRE */}
        <Section id="fire" title="Fire & Burning" icon="🔥">
          <p className="text-foreground-secondary">
            Fire is a damage-over-time mechanic. There are two types: microburnings (small fires) and big fires.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-orange-400 font-semibold text-sm mb-1">🔸 Microburning</h4>
              <p className="text-foreground-secondary text-xs">
                <span className="text-accent font-mono">4</span> damage per tick (1 second). Caused by round shots, heated shots, and some special effects. Reduced by PMicrofireFightingSpeed.
              </p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-red-400 font-semibold text-sm mb-1">🔥 Big Fire</h4>
              <p className="text-foreground-secondary text-xs">
                Sustained fire that deals continuous damage. Fighting speed boosted by PBigFireFightingSpeed. Damage reduced by PReduceBigFireDamage.
              </p>
            </div>
          </div>

          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2 mt-3">
            <li>Heated Shots: ×0.9 hull damage but ×7 sail damage + creates fire areas</li>
            <li>Phosphorous Shots (arena): special burning effects via BCannonBallFosforEffects</li>
            <li>Fire areas persist on the water — sailing through them ignites your ship</li>
          </ul>
        </Section>

        {/* BOARDING */}
        <Section id="boarding" title="Boarding" icon="🏴‍☠️">
          <p className="text-foreground-secondary">
            Boarding is close-range ship-to-ship combat where your crew fights the enemy crew directly.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Key Mechanics</h3>
          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2">
            <li>Musketeers provide defense bonus: BBoardingStartsMusketeersDefence</li>
            <li>Protection damage modifiers vary by crew type</li>
            <li>Chance to steal a cannon on successful boarding</li>
            <li>XP bonus awarded for boarding victories</li>
            <li>NPC targeting follows specific priority rules</li>
          </ul>

          <InfoBox variant="info" title="Boarding tip">
            Load up on boarding crew (Musketeers, Soldiers, Mercenaries) before engaging. Sailors fight too, but with lower damage and health. Having the crew advantage is usually decisive.
          </InfoBox>
        </Section>

        {/* RAMMING */}
        <Section id="ramming" title="Ramming" icon="💢">
          <p className="text-foreground-secondary">
            Ship-to-ship collisions deal velocity-based damage. Higher relative speed = more damage.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 mt-2">
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-foreground font-semibold text-sm mb-1">Hard Impact</h4>
              <p className="text-foreground-secondary text-xs">
                High speed collision. Full damage + physics knockback. Can cause corpus critical (speed drops to 30% for 10 seconds).
              </p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <h4 className="text-foreground font-semibold text-sm mb-1">Soft Collision</h4>
              <p className="text-foreground-secondary text-xs">
                Low speed bump. Ships push apart, no damage dealt.
              </p>
            </div>
          </div>

          <InfoBox variant="tip" title="From our PvP data">
            Reef collision damage ranged from <span className="text-accent font-mono">12-23</span> (glancing) to <span className="text-accent font-mono">73-156</span> (hard impact). Damage is asymmetric — the faster ship takes more.
          </InfoBox>

          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2 mt-3">
            <li>PAddCollisionDamage upgrade increases ram damage</li>
            <li>BDestroyFloodingShopByCollision: ram a flooding ship to finish it</li>
            <li>Ramming a flooding ship reduces their flooding by damage/maxHP</li>
          </ul>
        </Section>

        {/* KEGS */}
        <Section id="kegs" title="Powder Kegs" icon="🧨">
          <p className="text-foreground-secondary">
            Drop explosive barrels behind your ship. They detonate when an enemy enters the trigger radius.
          </p>

          <div className="bg-surface border border-surface-border rounded-xl overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-right">Damage</th>
                  <th className="px-4 py-2 text-right">Count</th>
                  <th className="px-4 py-2 text-right">Reload</th>
                  <th className="px-4 py-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Small Gunpowder', 125, 4, '25s', '30g'],
                  ['Small Flaming', 100, 2, '25s', '80g'],
                  ['Gunpowder', 350, 4, '50s', '150g'],
                  ['Flaming', 200, 2, '50s', '300g'],
                  ['Large Gunpowder', 500, 6, '90s', '300g'],
                  ['Large Flaming', 400, 3, '90s', '600g'],
                ].map(([name, dmg, count, reload, cost]) => (
                  <tr key={name as string} className="border-b border-surface-border">
                    <td className="px-4 py-2 text-foreground">{name}</td>
                    <td className="px-4 py-2 text-right text-red-400 font-mono">{dmg}</td>
                    <td className="px-4 py-2 text-right text-foreground-secondary">{count}</td>
                    <td className="px-4 py-2 text-right text-foreground-secondary">{reload}</td>
                    <td className="px-4 py-2 text-right text-accent font-mono">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox variant="warning" title="Flooding interaction">
            Powder keg hits on a flooding ship trigger <span className="text-red-400 font-semibold">instant sink</span> — same as stern hits, mortar hits, and fire while flooding.
          </InfoBox>
        </Section>

        {/* FLOODING */}
        <Section id="flooding" title="Flooding & Sinking" icon="🌊">
          <p className="text-foreground-secondary">
            When a ship&apos;s HP reaches zero, it doesn&apos;t immediately sink — it enters a flooding state. During flooding, the ship slowly takes on water and can still be saved with repairs.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Instant Sink Triggers</h3>
          <p className="text-foreground-secondary">
            While a ship is flooding, any of these damage types will cause <span className="text-red-400 font-semibold">immediate destruction</span>:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Stern Hit', 'Powder Keg', 'Mortar Hit', 'Burning (if burn > 0)', 'Fireworks'].map(trigger => (
              <span key={trigger} className="text-xs px-3 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-800">
                {trigger}
              </span>
            ))}
          </div>

          <InfoBox variant="tip">
            This is why mortars and stern shots are so dangerous in the endgame — they&apos;re not about raw damage, they&apos;re about finishing off flooding ships before they can repair.
          </InfoBox>
        </Section>

        {/* WEATHER */}
        <Section id="weather" title="Weather" icon="⛈️">
          <p className="text-foreground-secondary">
            Weather affects visibility, wave height, and wind power. Storms move across the map.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Sea States</h3>
          <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                  <th className="px-4 py-2 text-left">State</th>
                  <th className="px-4 py-2 text-right">Wave Height</th>
                  <th className="px-4 py-2 text-right">Wind Power</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['☀️ Calm', '0.3m', '15%'],
                  ['🌤️ Restless', '0.7m', '40%'],
                  ['⛈️ Storm', '1.1m', '70%'],
                  ['🌪️ Dangerous Storm', '3.5m', '100%'],
                ].map(([state, wave, wind]) => (
                  <tr key={state as string} className="border-b border-surface-border">
                    <td className="px-4 py-2 text-foreground">{state}</td>
                    <td className="px-4 py-2 text-right text-cyan-400 font-mono">{wave}</td>
                    <td className="px-4 py-2 text-right text-foreground-secondary">{wind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-foreground font-semibold mt-4">Sky & Visibility</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {[
              { name: 'Sunny', fog: '0%' },
              { name: 'Cloudy', fog: '10%' },
              { name: 'Rain', fog: '40%' },
              { name: 'Heavy Rain', fog: '60%' },
            ].map(s => (
              <div key={s.name} className="bg-surface border border-surface-border rounded-lg p-3 text-center">
                <div className="text-foreground text-xs font-medium">{s.name}</div>
                <div className="text-foreground-muted text-xs">Fog: {s.fog}</div>
              </div>
            ))}
          </div>

          <ul className="list-disc list-inside text-foreground-secondary space-y-1 ml-2 mt-3">
            <li>Storm areas move across the map (crossing time: ~23 minutes)</li>
            <li>Wave height scales 0.6×-2.06× based on water depth</li>
            <li>Wind changes direction every 20 seconds, weather shifts every 60 seconds</li>
          </ul>
        </Section>

        {/* SPEED */}
        <Section id="speed" title="Speed & Mobility" icon="⛵">
          <h3 className="text-foreground font-semibold">Speed Calculation</h3>
          <Formula>
            <Var>Speed</Var> = <Var>BasicSpeed</Var> × (1 + <Var>PSpeed%</Var>) + <Var>MSpeed</Var>
          </Formula>

          <h3 className="text-foreground font-semibold mt-4">Cargo Penalty</h3>
          <p className="text-foreground-secondary">
            Carrying cargo reduces your speed. The heavier you are, the slower you go. Trading ships with large holds can still move fast if they have speed upgrades.
          </p>

          <h3 className="text-foreground font-semibold mt-4">Damage Speed Reduction</h3>
          <p className="text-foreground-secondary">
            Taking damage while in marching mode reduces your bonus speed proportionally. The formula:
          </p>
          <Formula>
            <Var>SpeedLoss</Var> = <Var>Damage</Var> / (1 + <Var>currentHP</Var>) × 100 + <Var>SailDamage</Var> × 100
          </Formula>

          <h3 className="text-foreground font-semibold mt-4">Mobility</h3>
          <Formula>
            <Var>Mobility</Var> = <Var>BasicMobility</Var> × (1 + <Var>PMobilityBonus%</Var>) + <Var>MMobilityBonus</Var>
          </Formula>
        </Section>

        {/* Source attribution */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 text-xs text-foreground-muted">
          <p className="font-semibold text-foreground-secondary mb-1">📊 Data Sources</p>
          <p>Formulas extracted from decompiled game code (Common.dll, Reskana_7_0.dll). PvP damage data from 125 network packet captures. Angle multipliers, stern mechanics, and mortar bypass confirmed through real gameplay testing.</p>
        </div>
      </div>
    </div>
  )
}
