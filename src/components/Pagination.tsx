import React from 'react'

interface PaginationProps {
  page: number
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

const Pagination: React.FC<PaginationProps> = ({ page, hasNext, onPrev, onNext }) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>
      <span className="text-sm text-slate-300">Page {page}</span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination

