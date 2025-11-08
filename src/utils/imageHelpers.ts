import type { Anime } from '../features/anime/animeSlice'

export const getAnimeImageUrl = (anime: Anime): string => {
  return (
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.image_url ||
    ''
  )
}

