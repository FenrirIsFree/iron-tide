'use client'

import { useMemo, useState } from 'react'

interface TradeGood {
  name: string
  weight: number
  minPrice: number
  maxPrice: number
  margin: number
  profitPerWeight: number
  rank: number
}

interface TradingConstants {
  tradeOrderLifetimeDays: number
  p2pTradingTax: number
  rareItemTradingTax: number
  unavailableCannonTradingTax: number
  guildMemberTaxDiscount: number
  enemyFactionTaxPenalty: number
  [key: string]: unknown
}

interface TradingData {
  goods: TradeGood[]
  constants: TradingConstants
}

type SortKey = 'name' | 'margin' | 'profitPerWeight' | 'weight' | 'rank'

export default function TradingContent({ trading }: { trading: TradingData }) {
  const { goods, constants } = trading
  const [sortKey, setSortKey] = useState<SortKey>('profitPerWeight')
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = useMemo(() => {
    return [...goods].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else cmp = (a[sortKey] as number) - (b[sortKey] as number)
      return sortAsc ? cmp : -cmp
    })
  }, [goods, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'name') }
  }

  function SortHeader({ label, field, align }: { label: string; field: SortKey; align?: string }) {
    return (
      <th
        className={`px-4 py-3 cursor-pointer hover:text-accent transition-colors select-none ${align || 'text-left'}`}
        onClick={() => toggleSort(field)}
      >
        {label} {sortKey === field && (sortAsc ? '↑' : '↓')}
      </th>
    )
  }

  return (
    <div className="space-y-8">
      {/* Tax rates & constants */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">📊</span> Trading Rules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Player-to-Player Tax</span>
            <div className="text-accent font-bold text-lg">{(constants.p2pTradingTax * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Rare Item Tax</span>
            <div className="text-accent font-bold text-lg">{(constants.rareItemTradingTax * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Guild Discount</span>
            <div className="text-green-400 font-bold text-lg">{((1 - constants.guildMemberTaxDiscount) * 100).toFixed(0)}% off</div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Enemy Faction Penalty</span>
            <div className="text-red-400 font-bold text-lg">{constants.enemyFactionTaxPenalty}× tax</div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Order Lifetime</span>
            <div className="text-foreground font-bold text-lg">{constants.tradeOrderLifetimeDays} days</div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4">
            <span className="text-foreground-muted text-xs">Cannon Tax</span>
            <div className="text-accent font-bold text-lg">{(constants.unavailableCannonTradingTax * 100).toFixed(0)}%</div>
          </div>
        </div>
      </section>

      {/* Trade goods table */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent">📦</span> Trade Goods
          <span className="text-foreground-muted text-sm font-normal">({goods.length} goods)</span>
        </h2>
        <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-foreground-secondary text-xs">
                  <SortHeader label="Good" field="name" />
                  <SortHeader label="Min" field="rank" align="text-right" />
                  <SortHeader label="Max" field="rank" align="text-right" />
                  <SortHeader label="Margin" field="margin" align="text-right" />
                  <SortHeader label="Weight" field="weight" align="text-right" />
                  <SortHeader label="Profit/Weight" field="profitPerWeight" align="text-right" />
                  <th className="px-4 py-3 text-left">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(g => {
                  const maxProfit = Math.max(...goods.map(x => x.profitPerWeight))
                  const pct = maxProfit > 0 ? (g.profitPerWeight / maxProfit) * 100 : 0
                  return (
                    <tr key={g.name} className="border-b border-surface-border hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">{g.name}</td>
                      <td className="px-4 py-3 text-right text-foreground-secondary font-mono">{g.minPrice}</td>
                      <td className="px-4 py-3 text-right text-foreground-secondary font-mono">{g.maxPrice}</td>
                      <td className="px-4 py-3 text-right text-green-400 font-mono font-semibold">{g.margin}</td>
                      <td className="px-4 py-3 text-right text-foreground-secondary font-mono">{g.weight}</td>
                      <td className="px-4 py-3 text-right text-accent font-mono font-bold">{g.profitPerWeight.toFixed(2)}</td>
                      <td className="px-4 py-3 w-28">
                        <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-foreground-muted text-xs mt-2">
          Profit/Weight = gold margin per cargo weight unit. Higher = more efficient to haul.
        </p>
      </section>
    </div>
  )
}
