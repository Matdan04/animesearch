import type { Anime } from '../api/animeApi'

const FAVORITES_KEY = 'favorites-v1'

export type FavoritesMap = Record<number, Anime>

export const loadFavorites = (): FavoritesMap => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as FavoritesMap
    if (parsed && typeof parsed === 'object') return parsed
    return {}
  } catch {
    return {}
  }
}

export const saveFavorites = (favorites: FavoritesMap): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch {
    // ignore write errors (quota, etc.)
  }
}

