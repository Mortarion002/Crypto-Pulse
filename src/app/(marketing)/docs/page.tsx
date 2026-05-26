import type { Metadata } from 'next'
import Link from 'next/link'

import MarketingPageShell, {
  DetailList,
  InlineCode,
  MarketingCard,
  StatusPill,
} from '@/shared/components/MarketingPageShell'

export const metadata: Metadata = {
  title: 'Docs | Crypto Pulse',
  description:
    'Crypto Pulse product documentation for dashboard, sentiment, watchlist, and internal API routes.',
}

export default function DocsPage() {
  return (
    <MarketingPageShell
      currentHref="/docs"
      description="Practical notes for getting useful signal from Crypto Pulse quickly, from first login to reading market sentiment and following individual assets."
      eyebrow="Docs"
      title="Product docs"
      updated="Updated May 26, 2026"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid grid-cols-1 gap-5">
          <MarketingCard eyebrow="Start" title="Quick path">
            <DetailList
              items={[
                'Create an account or log in from the landing page.',
                'Open the dashboard to read the current market mood and top movers.',
                'Add coins to your watchlist so repeat checks stay focused.',
                'Use insights to compare breadth, volatility, gainers, and losers.',
              ]}
            />
          </MarketingCard>

          <MarketingCard eyebrow="Signals" title="Sentiment states">
            <div className="flex flex-col gap-3">
              <StatusPill label="Bullish" />
              <StatusPill label="Neutral" tone="purple" />
              <StatusPill label="Bearish" tone="red" />
            </div>
            <p className="mt-4">
              Sentiment labels summarize market context. Treat them as a
              starting point for research, not as trade instructions.
            </p>
          </MarketingCard>
        </div>

        <MarketingCard eyebrow="Guide" title="Core surfaces">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 transition-colors hover:border-[rgba(0,255,133,0.28)]"
            >
              <p className="text-base font-bold text-white">Dashboard</p>
              <p className="mt-2 text-sm text-[#8A8A9A]">
                Market mood, gainers, losers, volatility, and top coin cards.
              </p>
            </Link>
            <Link
              href="/insights"
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 transition-colors hover:border-[rgba(0,255,133,0.28)]"
            >
              <p className="text-base font-bold text-white">Insights</p>
              <p className="mt-2 text-sm text-[#8A8A9A]">
                Breadth, volatility, top movers, and signal summary cards.
              </p>
            </Link>
            <Link
              href="/watchlist"
              className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5 transition-colors hover:border-[rgba(0,255,133,0.28)]"
            >
              <p className="text-base font-bold text-white">Watchlist</p>
              <p className="mt-2 text-sm text-[#8A8A9A]">
                Saved assets for faster repeat monitoring across sessions.
              </p>
            </Link>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-base font-bold text-white">Coin pages</p>
              <p className="mt-2 text-sm text-[#8A8A9A]">
                Per-asset details available at <InlineCode>/coin/[symbol]</InlineCode>.
              </p>
            </div>
          </div>
        </MarketingCard>

        <MarketingCard className="lg:col-span-2" eyebrow="Developers" title="Internal data routes">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ['/api/market', 'Market list with prices and sentiment.'],
              ['/api/insights', 'Aggregate breadth and mover intelligence.'],
              ['/api/coin/[symbol]', 'Coin detail data for a specific symbol.'],
            ].map(([route, detail]) => (
              <div
                key={route}
                className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <p className="font-mono text-sm font-bold text-[#00FF85]">{route}</p>
                <p className="mt-2 text-sm text-[#8A8A9A]">{detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[#8A8A9A]">
            These routes support the current app experience. Public API access,
            keys, and rate limits should be confirmed before production use.
          </p>
        </MarketingCard>
      </div>
    </MarketingPageShell>
  )
}
