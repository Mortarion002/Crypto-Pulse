export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral'

export interface CoinData {
  symbol: string
  displaySymbol: string
  name: string
  price: number
  priceChange: number
  high24h: number
  low24h: number
  volume: number
  sentiment: Sentiment
  color: string
}

export interface KlineData {
  time: string
  price: number
  high: number
  low: number
  volume: number
}

export interface InsightsData {
  marketMood: Sentiment
  gainers: number
  losers: number
  gainersPercent: number
  topGainers: CoinData[]
  topLosers: CoinData[]
  volatility: 'Low' | 'Moderate' | 'High'
  insightHeadline: string
  insightSubtext: string
}
