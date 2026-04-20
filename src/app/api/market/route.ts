import type { CoinData } from '@/features/market/types'
import { getSentiment } from '@/shared/utils/sentiment'

const COINS = [
  { geckoId: 'bitcoin',      displaySymbol: 'BTC', name: 'Bitcoin',  color: '#F7931A' },
  { geckoId: 'ethereum',     displaySymbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { geckoId: 'solana',       displaySymbol: 'SOL', name: 'Solana',   color: '#14F195' },
  { geckoId: 'binancecoin',  displaySymbol: 'BNB', name: 'BNB',      color: '#F3BA2F' },
  { geckoId: 'cardano',      displaySymbol: 'ADA', name: 'Cardano',  color: '#0033AD' },
  { geckoId: 'ripple',       displaySymbol: 'XRP', name: 'XRP',      color: '#00AAE4' },
]

interface GeckoMarket {
  id: string
  current_price: number
  price_change_percentage_24h: number
  high_24h: number
  low_24h: number
  total_volume: number
}

export async function GET() {
  try {
    const ids = COINS.map((c) => c.geckoId).join(',')
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
    const res = await fetch(url, { next: { revalidate: 30 } })

    if (!res.ok) {
      return Response.json({ error: 'CoinGecko API error' }, { status: 502 })
    }

    const markets: GeckoMarket[] = await res.json()

    const coins: CoinData[] = markets.map((m) => {
      const meta = COINS.find((c) => c.geckoId === m.id)!
      const priceChange = m.price_change_percentage_24h ?? 0
      return {
        symbol: meta.geckoId,
        displaySymbol: meta.displaySymbol,
        name: meta.name,
        color: meta.color,
        price: m.current_price,
        priceChange,
        high24h: m.high_24h,
        low24h: m.low_24h,
        volume: m.total_volume,
        sentiment: getSentiment(priceChange),
      }
    })

    return Response.json(coins)
  } catch {
    return Response.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
