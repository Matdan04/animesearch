import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { getAnimeSearch } from '../features/anime/animeThunks'
import {
  selectResults,
  selectPagination,
  selectSearchStatus,
  selectError,
  setSearchQuery,
  setPage,
  selectSearchQuery,
} from '../features/anime/animeSlice'
import { useDebounce } from '../hooks/useDebounce'
import type { Anime } from '../api/animeApi'

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const results = useSelector(selectResults)
  const pagination = useSelector(selectPagination)
  const status = useSelector(selectSearchStatus)
  const error = useSelector(selectError)
  const queryFromStore = useSelector(selectSearchQuery)
  const favorites = useSelector((state: RootState) => state.anime.favorites)

  const [query, setQuery] = useState<string>(queryFromStore)
  const debounced = useDebounce(query, 250)

  useEffect(() => {
    dispatch(setSearchQuery(query))
  }, [query, dispatch])

  useEffect(() => {
    if (debounced.trim().length === 0) return
    dispatch(setPage(1))
    dispatch(getAnimeSearch({ query: debounced, page: 1 }))
  }, [debounced, dispatch])

  const handlePrev = () => {
    if (pagination.page <= 1) return
    const newPage = pagination.page - 1
    dispatch(setPage(newPage))
    dispatch(getAnimeSearch({ query: debounced, page: newPage }))
  }

  const handleNext = () => {
    if (!pagination.hasNext) return
    const newPage = pagination.page + 1
    dispatch(setPage(newPage))
    dispatch(getAnimeSearch({ query: debounced, page: newPage }))
  }

  const showEmpty = debounced.trim().length > 0 && status === 'succeeded' && results.length === 0
  const showError = status === 'failed' && error

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />
      {status === 'loading' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-white border border-slate-200 animate-pulse dark:bg-white/5 dark:border-white/10">
              <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showError && (
        <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-200">
          {error}
        </div>
      )}

      {showEmpty && (
        <div className="text-center text-slate-300">
          No anime found for this search.
        </div>
      )}

      {status !== 'loading' && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            hasNext={pagination.hasNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}

      {debounced.trim().length === 0 && (
        <div className="space-y-4">
          <div className="text-center text-slate-600 dark:text-slate-300">
            Start typing to search for anime.
          </div>
          {Object.keys(favorites).length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Your Favorites</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {Object.values(favorites).map((anime: Anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchPage
