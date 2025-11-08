import { configureStore } from '@reduxjs/toolkit'
import animeReducer from '../features/anime/animeSlice'
import { saveFavorites } from '../utils/storage'

export const store = configureStore({
  reducer: {
    anime: animeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Persist favorites to localStorage on changes
let lastSerialized = ''
store.subscribe(() => {
  const state = store.getState()
  const favorites = state.anime.favorites
  const serialized = JSON.stringify(favorites)
  if (serialized !== lastSerialized) {
    saveFavorites(favorites)
    lastSerialized = serialized
  }
})
