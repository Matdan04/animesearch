import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import {
  selectSearchQuery,
  selectSelectedGenreId,
  selectSortOrder,
  setSearchQuery,
  setPage,
  resetSearch,
} from '../features/anime/animeSlice'
import { getAnimeSearch } from '../features/anime/animeThunks'
import { useDebounce } from './useDebounce'

export const useAnimeSearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const queryFromStore = useSelector(selectSearchQuery)
  const selectedGenreId = useSelector(selectSelectedGenreId)
  const sortOrder = useSelector(selectSortOrder)

  const [query, setQuery] = useState<string>(queryFromStore)
  const debouncedQuery = useDebounce(query, 250)

  // Keep local input in sync with store (e.g., when header resets search)
  useEffect(() => {
    if (query !== queryFromStore) {
      setQuery(queryFromStore)
    }
  }, [queryFromStore])

  // Update store when local query changes
  useEffect(() => {
    dispatch(setSearchQuery(query))
  }, [query, dispatch])

  // Fetch results when debounced query, genre, or sort changes
  useEffect(() => {
    if (debouncedQuery.trim().length === 0 && !selectedGenreId) return

    dispatch(setPage(1))
    dispatch(
      getAnimeSearch({
        query: debouncedQuery,
        page: 1,
        genres: selectedGenreId ? [selectedGenreId] : undefined,
        sort: sortOrder,
      }),
    )
  }, [debouncedQuery, selectedGenreId, sortOrder, dispatch])

  return {
    query,
    setQuery,
    debouncedQuery,
  }
}

