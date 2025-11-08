import React from 'react'

interface LoadingSkeletonProps {
  count?: number
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-white border border-slate-200 animate-pulse dark:bg-white/5 dark:border-white/10"
        >
          <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton

