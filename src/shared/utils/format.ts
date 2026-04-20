export function formatPrice(p: number): string {
  if (p >= 1000) {
    return (
      '$' +
      p.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  if (p >= 1) {
    return '$' + p.toFixed(2)
  }

  return '$' + p.toFixed(4)
}

export function formatChange(c: number): string {
  return (c >= 0 ? '+' : '') + c.toFixed(2) + '%'
}
