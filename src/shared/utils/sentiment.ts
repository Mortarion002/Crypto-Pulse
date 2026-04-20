export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral'

export function getSentiment(priceChangePercent: number): Sentiment {
  if (priceChangePercent > 2) return 'Bullish'
  if (priceChangePercent < -2) return 'Bearish'
  return 'Neutral'
}

export function getMarketSentiment(gainers: number, losers: number): Sentiment {
  if (gainers > losers * 2) return 'Bullish'
  if (losers > gainers * 2) return 'Bearish'
  return 'Neutral'
}

export function getSentimentColor(sentiment: Sentiment): string {
  if (sentiment === 'Bullish') return '#00FF85'
  if (sentiment === 'Bearish') return '#FF4D4D'
  return '#9B6DFF'
}
