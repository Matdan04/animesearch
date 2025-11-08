import React from 'react'
import AnimeCard from './AnimeCard'
import Pagination from './Pagination'
import SortControl from './SortControl'
import type { Anime } from '../api/animeApi'

interface SearchResultsProps {
  results: Anime[]
  sortOrder: 'asc' | 'desc'
  page: number
  hasNext: boolean
  onSortChange: (order: 'asc' | 'desc') => void
  onPageChange: (page: number) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  sortOrder,
  page,
  hasNext,
  onSortChange,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (page <= 1) return
    onPageChange(page - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    if (!hasNext) return
    onPageChange(page + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Sort + Pagination controls */}
      <div className="flex items-center justify-between mb-4">
        <SortControl value={sortOrder} onChange={onSortChange} />
        <Pagination
          page={page}
          hasNext={hasNext}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map(anime => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </>
  )
}

export default SearchResults

