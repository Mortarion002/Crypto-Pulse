import type { CoinData, InsightsData } from '@/features/market/types'
import { getSentiment, getMarketSentiment } from '@/shared/utils/sentiment'

const COINS = [
  { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'SOLUSDT', displaySymbol: 'SOL', name: 'Solana', color: '#14F195' },
  { symbol: 'BNBUSDT', displaySymbol: 'BNB', name: 'BNB', color: '#F3BA2F' },
  { symbol: 'ADAUSDT', displaySymbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  { symbol: 'XRPUSDT', displaySymbol: 'XRP', name: 'XRP', color: '#00AAE4' },
]

interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  quoteVolume: string
}

function deriveVolatility(coins: CoinData[]): 'Low' | 'Moderate' | 'High' {
  const avg = coins.reduce((sum, c) => sum + Math.abs(c.priceChange), 0) / coins.length
  if (avg < 2) return 'Low'
  if (avg < 5) return 'Moderate'
  return 'High'
}

function deriveHeadline(mood: InsightsData['marketMood'], gainers: number, losers: number): string {
  if (mood === 'Bullish') return `${gainers} coins surging — broad market rally`
  if (mood === 'Bearish') return `${losers} coins declining — bearish pressure`
  return 'Market consolidating — mixed signals across sectors'
}

function deriveSubtext(mood: InsightsData['marketMood'], coins: CoinData[]): string {
  const btc = coins.find((c) => c.displaySymbol === 'BTC')
  if (!btc) return 'Monitor key support and resistance levels'
  if (mood === 'Bullish') return `BTC leading with ${btc.priceChange > 0 ? '+' : ''}${btc.priceChange.toFixed(2)}% — altcoins following`
  if (mood === 'Bearish') return `BTC down ${btc.priceChange.toFixed(2)}% — sentiment broadly negative`
  return `BTC flat at ${btc.priceChange.toFixed(2)}% — wait for directional confirmation`
}

export async function GET() {
  try {
    const symbols = JSON.stringify(COINS.map((c) => c.symbol))
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`
    const res = await fetch(url, { next: { revalidate: 30 } })

    if (!res.ok) {
      return Response.json({ error: 'Binance API error' }, { status: 502 })
    }

    const tickers: BinanceTicker[] = await res.json()

    const coins: CoinData[] = tickers.map((ticker) => {
      const meta = COINS.find((c) => c.symbol === ticker.symbol)!
      const priceChange = parseFloat(ticker.priceChangePercent)
      return {
        symbol: ticker.symbol,
        displaySymbol: meta.displaySymbol,
        name: meta.name,
        color: meta.color,
        price: parseFloat(ticker.lastPrice),
        priceChange,
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        volume: parseFloat(ticker.quoteVolume),
        sentiment: getSentiment(priceChange),
      }
    })

    const gainers = coins.filter((c) => c.priceChange > 0).length
    const losers = coins.filter((c) => c.priceChange < 0).length
    const total = coins.length
    const gainersPercent = Math.round((gainers / total) * 100)

    const topGainers = [...coins].sort((a, b) => b.priceChange - a.priceChange).slice(0, 3)
    const topLosers = [...coins].sort((a, b) => a.priceChange - b.priceChange).slice(0, 3)

    const marketMood = getMarketSentiment(gainers, losers)
    const volatility = deriveVolatility(coins)

    const insights: InsightsData = {
      marketMood,
      gainers,
      losers,
      gainersPercent,
      topGainers,
      topLosers,
      volatility,
      insightHeadline: deriveHeadline(marketMood, gainers, losers),
      insightSubtext: deriveSubtext(marketMood, coins),
    }

    return Response.json(insights)
  } catch {
    return Response.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
