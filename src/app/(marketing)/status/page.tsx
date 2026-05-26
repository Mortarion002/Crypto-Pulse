import type { Metadata } from 'next'

import MarketingPageShell, {
  MarketingCard,
  StatusPill,
} from '@/shared/components/MarketingPageShell'

export const metadata: Metadata = {
  title: 'Status | Crypto Pulse',
  description:
    'Current Crypto Pulse service health for the landing site, auth, market data, and watchlist sync.',
}

const systems = [
  { name: 'Landing site', detail: 'Public marketing pages and navigation', latency: 'Fast' },
  { name: 'Authentication', detail: 'Login, signup, and session handling', latency: 'Normal' },
  { name: 'Market API', detail: 'Prices, movers, and coin detail data', latency: 'Normal' },
  { name: 'Sentiment engine', detail: 'Bullish, bearish, and neutral classifications', latency: 'Normal' },
  { name: 'Watchlist sync', detail: 'Saved coins and account preferences', latency: 'Normal' },
]

export default function StatusPage() {
  return (
    <MarketingPageShell
      currentHref="/status"
      description="A concise health snapshot for the Crypto Pulse experience. Use it to see whether core surfaces are operating normally before checking local network or account issues."
      eyebrow="Status"
      title="All systems operational"
      updated="Last checked May 26, 2026"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <MarketingCard eyebrow="Live health" title="Service components">
          <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.06)]">
            {systems.map((system) => (
              <div
                key={system.name}
                className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-white">{system.name}</p>
                  <p className="mt-1 text-sm text-[#8A8A9A]">{system.detail}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#555566]">
                    {system.latency}
                  </span>
                  <StatusPill label="Operational" />
                </div>
              </div>
            ))}
          </div>
        </MarketingCard>

        <div className="grid grid-cols-1 gap-5">
          <MarketingCard eyebrow="Reliability" title="Current summary">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-mono text-2xl font-bold text-[#00FF85]">99.9%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8A8A9A]">
                  Target uptime
                </p>
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-mono text-2xl font-bold text-[#00FF85]">2s</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8A8A9A]">
                  Market cadence
                </p>
              </div>
            </div>
          </MarketingCard>

          <MarketingCard eyebrow="Incidents" title="Recent history">
            <p>No active incidents are reported.</p>
            <p className="mt-4 text-[#8A8A9A]">
              This page reports Crypto Pulse service health, not live financial
              market conditions.
            </p>
          </MarketingCard>
        </div>
      </div>
    </MarketingPageShell>
  )
}
