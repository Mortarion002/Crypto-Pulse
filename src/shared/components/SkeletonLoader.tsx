interface SkeletonLoaderProps {
  variant: 'card' | 'row' | 'text'
  count?: number
}

const variantClasses: Record<SkeletonLoaderProps['variant'], string> = {
  card: 'h-40 w-full rounded-xl',
  row: 'h-[72px] w-full rounded-lg',
  text: 'h-4 w-3/5 rounded',
}

export default function SkeletonLoader({
  variant,
  count = 1,
}: SkeletonLoaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`${variant}-${index}`}
          className={`animate-pulse bg-[rgba(255,255,255,0.06)] ${variantClasses[variant]}`}
        />
      ))}
    </div>
  )
}
