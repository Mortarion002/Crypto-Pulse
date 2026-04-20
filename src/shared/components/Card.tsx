import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export default function Card({
  children,
  className,
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] ${
        noPadding ? '' : 'p-5'
      } ${className ?? ''}`.trim()}
    >
      {children}
    </div>
  )
}
