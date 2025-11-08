import React from 'react'
import SearchBar from '../components/SearchBar'
import CategorySidebar from '../components/CategorySidebar'
import SearchResults from '../components/SearchResults'
import HomePage from '../components/HomePage'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorDisplay from '../components/ErrorDisplay'
import EmptyState from '../components/EmptyState'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { getAnimeSearch } from '../features/anime/animeThunks'
import {
  selectResults,
  selectPagination,
  selectSearchStatus,
  selectError,
  setPage,
  selectTrending,
  selectTrendingStatus,
  selectSelectedGenreId,
  selectSortOrder,
  setSortOrder,
} from '../features/anime/animeSlice'
import { useAnimeSearch } from '../hooks/useAnimeSearch'
import { useInitialData } from '../hooks/useInitialData'

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Selectors
  const results = useSelector(selectResults)
  const pagination = useSelector(selectPagination)
  const status = useSelector(selectSearchStatus)
  const error = useSelector(selectError)
  const favorites = useSelector((state: RootState) => state.anime.favorites)
  const trending = useSelector(selectTrending)
  const trendingStatus = useSelector(selectTrendingStatus)
  const selectedGenreId = useSelector(selectSelectedGenreId)
  const sortOrder = useSelector(selectSortOrder)

  // Custom hooks
  const { query, setQuery, debouncedQuery } = useAnimeSearch()
  useInitialData(debouncedQuery)

  // Handlers
  const handleSortChange = (order: 'asc' | 'desc') => {
    dispatch(setSortOrder(order))
    dispatch(setPage(1))
    dispatch(
      getAnimeSearch({
        query: debouncedQuery,
        page: 1,
        genres: selectedGenreId ? [selectedGenreId] : undefined,
        sort: order,
      }),
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
    dispatch(
      getAnimeSearch({
        query: debouncedQuery,
        page,
        genres: selectedGenreId ? [selectedGenreId] : undefined,
        sort: sortOrder,
      }),
    )
  }

  // Computed states
  const showEmpty =
    (debouncedQuery.trim().length > 0 || selectedGenreId) &&
    status === 'succeeded' &&
    results.length === 0
  const showError = status === 'failed' && error
  const showResults = status !== 'loading' && results.length > 0
  const showHomePage = debouncedQuery.trim().length === 0 && !selectedGenreId

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <CategorySidebar />
        
        <div className="md:col-span-9 space-y-6">
          {status === 'loading' && <LoadingSkeleton count={10} />}
          {showError && <ErrorDisplay message={error!} />}
          {showEmpty && <EmptyState message="No anime found for this search." />}
          
          {showResults && (
            <SearchResults
              results={results}
              sortOrder={sortOrder}
              page={pagination.page}
              hasNext={pagination.hasNext}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
            />
          )}

          {showHomePage && (
            <HomePage
              favorites={favorites}
              trending={trending}
              trendingStatus={trendingStatus}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
