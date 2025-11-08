import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import {
  selectTrendingStatus,
  selectSearchStatus,
  selectResults,
  selectSelectedGenreId,
  resetSearch,
} from '../features/anime/animeSlice'

export const useInitialData = (debouncedQuery: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const trendingStatus = useSelector(selectTrendingStatus)
  const searchStatus = useSelector(selectSearchStatus)
  const results = useSelector(selectResults)
  const selectedGenreId = useSelector(selectSelectedGenreId)

  // Clear stale results when both query and genre are empty
  useEffect(() => {
    if (
      selectedGenreId === null &&
      debouncedQuery.trim().length === 0 &&
      (results.length > 0 || searchStatus !== 'idle')
    ) {
      dispatch(resetSearch())
    }
  }, [selectedGenreId, debouncedQuery, results.length, searchStatus, dispatch])

  // Load trending on initial load when no query
  useEffect(() => {
    if (debouncedQuery.trim().length === 0 && !selectedGenreId && trendingStatus === 'idle') {
      import('../features/anime/animeThunks').then(m => {
        dispatch(m.getTrendingAnime({ page: 1 }))
      })
    }
  }, [debouncedQuery, selectedGenreId, trendingStatus, dispatch])

  // Load genres once
  useEffect(() => {
    import('../features/anime/animeThunks').then(m => dispatch(m.getGenres()))
  }, [dispatch])
}

