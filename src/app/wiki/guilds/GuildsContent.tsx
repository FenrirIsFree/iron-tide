'use client'

interface GuildData {
  mechanics: Record<string, unknown>
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-surface-border rounded-xl p-5">
      <h3 className="text-foreground font-semibold mb-3">{title}</h3>
      {children}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-foreground-secondary">{label}</span>
      <span className="text-accent font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</span>
    </div>
  )
}

export default function GuildsContent({ data }: { data: GuildData }) {
  const m = data.mechanics
  const creation = m.creation as Record<string, number> || {}
  const limits = m.playerLimits as Record<string, number> || {}
  const economy = m.economy as Record<string, unknown> || {}
  const alliances = m.alliances as Record<string, unknown> || {}
  const hq = m.hq as Record<string, unknown> || {}
  const nationReqs = m.nationRequirements as Record<string, unknown> || {}
  const rankReqs = m.rankRequirements as Record<string, unknown> || {}
  const titles = m.titleDistribution as Record<string, unknown> || {}
  const upgradeCosts = m.upgradeCosts as Record<string, unknown> || {}

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">📋</span> Guild Basics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard title="🏗️ Creation">
            <StatRow label="Flotilla cost" value={`${creation.flotillaGoldCost?.toLocaleString() || '10,000'} gold`} />
            <StatRow label="Guild cost" value={`${creation.guildGoldCost?.toLocaleString() || '3,000,000'} gold`} />
            <StatRow label="Guild cost (with badges)" value={`${creation.guildGoldCostWithBadges?.toLocaleString() || '2,000,000'} gold`} />
            <p className="text-foreground-muted text-xs mt-2">
              Flotillas are smaller groups. Upgrade to a full Guild for more members and features.
            </p>
          </InfoCard>

          <InfoCard title="👥 Member Limits">
            <StatRow label="Flotilla max players" value={limits.flotillaMaxPlayers || 30} />
            <StatRow label="Guild max players" value={limits.guildMaxPlayers || 70} />
            <StatRow label="Flotilla initial slots" value={limits.flotillaInitialPlayers || 30} />
            <StatRow label="Guild initial slots" value={limits.guildInitialPlayers || 10} />
          </InfoCard>
        </div>
      </section>

      {/* Economy */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">💰</span> Guild Economy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard title="Treasury">
            <StatRow label="Salary share" value={`${((economy.salaryShare as number || 0.2) * 100).toFixed(0)}%`} />
            <StatRow label="Membership badges cost" value={`${economy.MembershipConquerBadgesPrice || 25} badges`} />
            <StatRow label="Reparation ingots cost" value={`${(economy.ReparationIngotsPrice as number || 5000).toLocaleString()} gold`} />
            <StatRow label="Make dispute cost" value={`${economy.MakeDisputePrice || 10} badges`} />
            <p className="text-foreground-muted text-xs mt-2">
              {economy.salaryNotes as string || 'Salary: 20% of money shared among guild members.'}
            </p>
          </InfoCard>

          {Object.keys(upgradeCosts).length > 0 && (
            <InfoCard title="Upgrade Costs">
              {Object.entries(upgradeCosts).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val.toLocaleString() : String(val)}
                />
              ))}
            </InfoCard>
          )}
        </div>
      </section>

      {/* Faction & Alliances */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">🏳️</span> Factions & Alliances
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(nationReqs).length > 0 && (
            <InfoCard title="Faction Requirements">
              {Object.entries(nationReqs).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val : String(val)}
                />
              ))}
            </InfoCard>
          )}

          {Object.keys(alliances).length > 0 && (
            <InfoCard title="Alliance System">
              {Object.entries(alliances).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val : String(val)}
                />
              ))}
            </InfoCard>
          )}
        </div>
      </section>

      {/* Titles & Ranking */}
      {Object.keys(titles).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-accent">👑</span> Title Competition
          </h2>
          <div className="bg-surface border border-surface-border rounded-xl p-5">
            <p className="text-foreground-secondary text-sm mb-3">
              Each faction has seasonal title competitions. Top guilds earn titles and gold rewards.
            </p>
            <div className="space-y-1">
              {Object.entries(titles).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val : String(val)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HQ & Misc */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">🏰</span> Headquarters & Other
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(hq).length > 0 && (
            <InfoCard title="Guild HQ">
              {Object.entries(hq).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val : String(val)}
                />
              ))}
            </InfoCard>
          )}

          {rankReqs && Object.keys(rankReqs).length > 0 && (
            <InfoCard title="Rank Requirements">
              {Object.entries(rankReqs).map(([key, val]) => (
                <StatRow
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                  value={typeof val === 'number' ? val : String(val)}
                />
              ))}
            </InfoCard>
          )}
        </div>
      </section>
    </div>
  )
}
