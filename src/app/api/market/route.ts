import type { CoinData } from '@/features/market/types'
import { getSentiment } from '@/shared/utils/sentiment'

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

    return Response.json(coins)
  } catch {
    return Response.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
