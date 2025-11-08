import React from 'react'

const DetailLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/2 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-[2/3] bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        <div className="md:col-span-2 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-200 dark:bg-white/10 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DetailLoadingSkeleton

