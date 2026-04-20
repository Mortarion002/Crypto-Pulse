import type { Sentiment } from '@/features/market/types'

const sentimentClasses: Record<Sentiment, string> = {
  Bullish:
    'border-[rgba(0,255,133,0.2)] bg-[rgba(0,255,133,0.08)] text-[#00FF85]',
  Bearish:
    'border-[rgba(255,77,77,0.2)] bg-[rgba(255,77,77,0.08)] text-[#FF4D4D]',
  Neutral:
    'border-[rgba(155,109,255,0.2)] bg-[rgba(155,109,255,0.08)] text-[#9B6DFF]',
}

interface TrendBadgeProps {
  sentiment: Sentiment
}

export default function TrendBadge({ sentiment }: TrendBadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${sentimentClasses[sentiment]}`}
    >
      {sentiment}
    </span>
  )
}
