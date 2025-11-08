import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Anime, SearchResponse, DetailResponse } from '../../api/animeApi'
import { getAnimeDetail, getAnimeSearch } from './animeThunks'
import type { RootState } from '../../app/store'
import { loadFavorites, type FavoritesMap } from '../../utils/storage'

export interface PaginationState {
  page: number
  perPage: number
  total: number
  hasNext: boolean
}

export interface AnimeState {
  searchQuery: string
  results: Anime[]
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  selectedAnime: Anime | null
  pagination: PaginationState
  favorites: FavoritesMap
}

const initialState: AnimeState = {
  searchQuery: '',
  results: [],
  searchStatus: 'idle',
  detailStatus: 'idle',
  error: null,
  selectedAnime: null,
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    hasNext: false,
  },
  favorites: loadFavorites(),
}

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload
    },
    clearSelected(state) {
      state.selectedAnime = null
      state.detailStatus = 'idle'
      state.error = null
    },
    toggleFavorite(state, action: PayloadAction<Anime>) {
      const id = action.payload.mal_id
      if (state.favorites[id]) {
        delete state.favorites[id]
      } else {
        state.favorites[id] = action.payload
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      delete state.favorites[action.payload]
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAnimeSearch.pending, state => {
        state.searchStatus = 'loading'
        state.error = null
      })
      .addCase(
        getAnimeSearch.fulfilled,
        (state, action: PayloadAction<SearchResponse>) => {
          state.searchStatus = 'succeeded'
          state.results = action.payload.data
          state.pagination.total = action.payload.pagination.items.total
          state.pagination.hasNext = action.payload.pagination.has_next_page
        },
      )
      .addCase(getAnimeSearch.rejected, (state, action) => {
        if (action.payload === 'cancelled') {
          return
        }
        state.searchStatus = 'failed'
        state.error = typeof action.payload === 'string' ? action.payload : 'Unknown error'
      })
      .addCase(getAnimeDetail.pending, state => {
        state.detailStatus = 'loading'
        state.error = null
        state.selectedAnime = null
      })
      .addCase(
        getAnimeDetail.fulfilled,
        (state, action: PayloadAction<DetailResponse>) => {
          state.detailStatus = 'succeeded'
          state.selectedAnime = action.payload.data
        },
      )
      .addCase(getAnimeDetail.rejected, (state, action) => {
        if (action.payload === 'cancelled') {
          return
        }
        state.detailStatus = 'failed'
        state.error = typeof action.payload === 'string' ? action.payload : 'Unknown error'
      })
  },
})

export const { setSearchQuery, setPage, clearSelected, toggleFavorite, removeFavorite } = animeSlice.actions

export const selectAnimeState = (state: RootState) => state.anime
export const selectResults = (state: RootState) => state.anime.results
export const selectSearchQuery = (state: RootState) => state.anime.searchQuery
export const selectPagination = (state: RootState) => state.anime.pagination
export const selectSearchStatus = (state: RootState) => state.anime.searchStatus
export const selectDetailStatus = (state: RootState) => state.anime.detailStatus
export const selectSelectedAnime = (state: RootState) => state.anime.selectedAnime
export const selectError = (state: RootState) => state.anime.error
export const selectFavoritesMap = (state: RootState) => state.anime.favorites
export const selectFavoritesList = (state: RootState) => Object.values(state.anime.favorites)

export default animeSlice.reducer
