import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import type { AppDispatch } from '../app/store'
import { getAnimeDetail } from '../features/anime/animeThunks'
import {
  selectDetailStatus,
  selectSelectedAnime,
  selectError,
  clearSelected,
  selectFavoritesMap,
  toggleFavorite,
} from '../features/anime/animeSlice'

export const useAnimeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const status = useSelector(selectDetailStatus)
  const anime = useSelector(selectSelectedAnime)
  const error = useSelector(selectError)
  const favorites = useSelector(selectFavoritesMap)

  const isFavorite = anime ? !!favorites[anime.mal_id] : false

  useEffect(() => {
    if (id) {
      dispatch(getAnimeDetail({ id }))
    }
    return () => {
      dispatch(clearSelected())
    }
  }, [id, dispatch])

  const handleBack = () => navigate(-1)

  const handleToggleFavorite = () => {
    if (anime) {
      dispatch(toggleFavorite(anime))
    }
  }

  return {
    status,
    anime,
    error,
    isFavorite,
    handleBack,
    handleToggleFavorite,
  }
}

