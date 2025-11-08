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
  selectTrending,
  selectTrendingStatus,
  selectGenres,
  selectGenresStatus,
  selectSelectedGenreId,
  selectSortOrder,
  setSelectedGenre,
  setSortOrder,
  resetSearch,
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
  const trending = useSelector(selectTrending)
  const trendingStatus = useSelector(selectTrendingStatus)
  const genres = useSelector(selectGenres)
  const genresStatus = useSelector(selectGenresStatus)
  const selectedGenreId = useSelector(selectSelectedGenreId)
  const sortOrder = useSelector(selectSortOrder)

  const [query, setQuery] = useState<string>(queryFromStore)
  const debounced = useDebounce(query, 250)

  // Keep local input in sync with store (e.g., when header resets search)
  useEffect(() => {
    if (query !== queryFromStore) {
      setQuery(queryFromStore)
    }
  }, [queryFromStore])

  useEffect(() => {
    dispatch(setSearchQuery(query))
  }, [query, dispatch])

  useEffect(() => {
    // If no query and no genre selected, skip fetching
    if (debounced.trim().length === 0 && !selectedGenreId) return
    dispatch(setPage(1))
    dispatch(
      getAnimeSearch({
        query: debounced,
        page: 1,
        genres: selectedGenreId ? [selectedGenreId] : undefined,
        sort: sortOrder,
      }),
    )
  }, [debounced, selectedGenreId, sortOrder, dispatch])

  // When both query and genre are cleared (e.g., user clicks "All" with empty query),
  // clear stale results so the homepage (favorites + trending) shows.
  useEffect(() => {
    if (
      selectedGenreId === null &&
      debounced.trim().length === 0 &&
      (results.length > 0 || status !== 'idle')
    ) {
      dispatch(resetSearch())
    }
  }, [selectedGenreId, debounced, results.length, status, dispatch])

  // Load trending on initial load when no query
  useEffect(() => {
    if (debounced.trim().length === 0 && !selectedGenreId && trendingStatus === 'idle') {
      // Lazy import to avoid circular dep; using thunk directly is fine
      import('../features/anime/animeThunks').then(m => {
        dispatch(m.getTrendingAnime({ page: 1 }))
      })
    }
  }, [debounced, selectedGenreId, trendingStatus, dispatch])

  // Load categories (genres) once
  useEffect(() => {
    import('../features/anime/animeThunks').then(m => dispatch(m.getGenres()))
  }, [dispatch])

  // Pagination buttons are replaced by infinite scroll

  const showEmpty = (debounced.trim().length > 0 || selectedGenreId) && status === 'succeeded' && results.length === 0
  const showError = status === 'failed' && error

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5 md:sticky md:top-20">
            <div className="text-sm font-semibold mb-2">Categories</div>
            {genresStatus === 'loading' && (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-slate-200 dark:bg-white/10 animate-pulse" />
                ))}
              </div>
            )}
            {genresStatus === 'succeeded' && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => dispatch(setSelectedGenre(null))}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                    selectedGenreId === null
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200'
                  }`}
                >
                  All
                </button>
                {genres.map(g => (
                  <button
                    key={g.mal_id}
                    onClick={() => dispatch(setSelectedGenre(g.mal_id))}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                      selectedGenreId === g.mal_id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
        <div className="md:col-span-9 space-y-6">
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
          {/* Sort + Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-slate-600 dark:text-slate-300">Sort by rating</label>
              <select
                id="sort"
                className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-300 dark:bg-white dark:text-slate-900"
                value={sortOrder}
                onChange={e => {
                  const order = e.target.value === 'asc' ? 'asc' : 'desc'
                  dispatch(setSortOrder(order))
                  dispatch(setPage(1))
                  dispatch(
                    getAnimeSearch({
                      query: debounced,
                      page: 1,
                      genres: selectedGenreId ? [selectedGenreId] : undefined,
                      sort: order,
                    }),
                  )
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <option value="desc">Highest → Lowest</option>
                <option value="asc">Lowest → Highest</option>
              </select>
            </div>
            <Pagination
              page={pagination.page}
              hasNext={pagination.hasNext}
              onPrev={() => {
                if (pagination.page <= 1) return
                const newPage = pagination.page - 1
                dispatch(setPage(newPage))
                dispatch(
                  getAnimeSearch({
                    query: debounced,
                    page: newPage,
                    genres: selectedGenreId ? [selectedGenreId] : undefined,
                    sort: sortOrder,
                  }),
                )
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onNext={() => {
                if (!pagination.hasNext) return
                const newPage = pagination.page + 1
                dispatch(setPage(newPage))
                dispatch(
                  getAnimeSearch({
                    query: debounced,
                    page: newPage,
                    genres: selectedGenreId ? [selectedGenreId] : undefined,
                    sort: sortOrder,
                  }),
                )
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
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
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Trending Now</h2>
            {trendingStatus === 'loading' && (
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
            {trendingStatus === 'succeeded' && trending.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {trending.map(anime => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
