import React from 'react'

interface DetailActionsProps {
  isFavorite: boolean
  onBack: () => void
  onToggleFavorite: () => void
}

const DetailActions: React.FC<DetailActionsProps> = ({
  isFavorite,
  onBack,
  onToggleFavorite,
}) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        ← Back to Search
      </button>
      <button
        onClick={onToggleFavorite}
        className="px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition dark:border-white/10 dark:bg-white/5 dark:text-rose-300 dark:hover:bg-white/10"
      >
        {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
      </button>
    </div>
  )
}

export default DetailActions

