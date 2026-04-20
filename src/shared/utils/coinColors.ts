const coinBadgeClasses: Record<string, string> = {
  BTC: 'bg-[#F7931A]',
  ETH: 'bg-[#627EEA]',
  SOL: 'bg-[#14F195]',
  BNB: 'bg-[#F3BA2F]',
  ADA: 'bg-[#0033AD]',
  XRP: 'bg-[#00AAE4]',
  DOT: 'bg-[#E6007A]',
  AVAX: 'bg-[#E84142]',
}

export function getCoinBadgeClass(symbol: string): string {
  return coinBadgeClasses[symbol.toUpperCase()] ?? 'bg-[#1F2431]'
}
