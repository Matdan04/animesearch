import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Anime, SearchResponse, DetailResponse, Genre, GenresResponse } from '../../api/animeApi'
import { getAnimeDetail, getAnimeSearch, getTrendingAnime, getGenres } from './animeThunks'
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
  loadMoreStatus: 'idle' | 'loading' | 'failed'
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  selectedAnime: Anime | null
  pagination: PaginationState
  favorites: FavoritesMap
  trending: Anime[]
  trendingStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  trendingError: string | null
  genres: Genre[]
  genresStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  genresError: string | null
  selectedGenreId: number | null
  sortOrder: 'asc' | 'desc'
}

const initialState: AnimeState = {
  searchQuery: '',
  results: [],
  searchStatus: 'idle',
  loadMoreStatus: 'idle',
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
  trending: [],
  trendingStatus: 'idle',
  trendingError: null,
  genres: [],
  genresStatus: 'idle',
  genresError: null,
  selectedGenreId: null,
  sortOrder: 'desc',
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
    resetSearch(state) {
      state.searchQuery = ''
      state.results = []
      state.searchStatus = 'idle'
      state.loadMoreStatus = 'idle'
      state.error = null
      state.pagination = { page: 1, perPage: 10, total: 0, hasNext: false }
      state.selectedGenreId = null
      state.sortOrder = 'desc'
    },
    setSelectedGenre(state, action: PayloadAction<number | null>) {
      state.selectedGenreId = action.payload
    },
    setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sortOrder = action.payload
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
      .addCase(getAnimeSearch.pending, (state, action) => {
        const append = Boolean(action.meta.arg.append)
        if (append) state.loadMoreStatus = 'loading'
        else state.searchStatus = 'loading'
        state.error = null
      })
      .addCase(
        getAnimeSearch.fulfilled,
        (state, action: PayloadAction<SearchResponse>) => {
          const append = Boolean((action as any).meta.arg.append)
          state.searchStatus = 'succeeded'
          state.loadMoreStatus = 'idle'
          if (append) {
            state.results = state.results.concat(action.payload.data)
          } else {
            state.results = action.payload.data
          }
          state.pagination.total = action.payload.pagination.items.total
          state.pagination.hasNext = action.payload.pagination.has_next_page
          state.pagination.page = (action as any).meta.arg.page
        },
      )
      .addCase(getAnimeSearch.rejected, (state, action) => {
        if (action.payload === 'cancelled') {
          state.loadMoreStatus = 'idle'
          return
        }
        const append = Boolean((action as any).meta.arg.append)
        if (append) state.loadMoreStatus = 'failed'
        else state.searchStatus = 'failed'
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
      .addCase(getTrendingAnime.pending, state => {
        state.trendingStatus = 'loading'
        state.trendingError = null
      })
      .addCase(getTrendingAnime.fulfilled, (state, action: PayloadAction<SearchResponse>) => {
        state.trendingStatus = 'succeeded'
        state.trending = action.payload.data
      })
      .addCase(getTrendingAnime.rejected, (state, action) => {
        if (action.payload === 'cancelled') return
        state.trendingStatus = 'failed'
        state.trendingError = typeof action.payload === 'string' ? action.payload : 'Unknown error'
      })
      .addCase(getGenres.pending, state => {
        state.genresStatus = 'loading'
        state.genresError = null
      })
      .addCase(getGenres.fulfilled, (state, action: PayloadAction<GenresResponse>) => {
        state.genresStatus = 'succeeded'
        state.genres = action.payload.data
      })
      .addCase(getGenres.rejected, (state, action) => {
        if (action.payload === 'cancelled') return
        state.genresStatus = 'failed'
        state.genresError = typeof action.payload === 'string' ? action.payload : 'Unknown error'
      })
  },
})

export const { setSearchQuery, setPage, clearSelected, resetSearch, setSelectedGenre, setSortOrder, toggleFavorite, removeFavorite } = animeSlice.actions

export const selectAnimeState = (state: RootState) => state.anime
export const selectResults = (state: RootState) => state.anime.results
export const selectSearchQuery = (state: RootState) => state.anime.searchQuery
export const selectPagination = (state: RootState) => state.anime.pagination
export const selectSearchStatus = (state: RootState) => state.anime.searchStatus
export const selectLoadMoreStatus = (state: RootState) => state.anime.loadMoreStatus
export const selectDetailStatus = (state: RootState) => state.anime.detailStatus
export const selectSelectedAnime = (state: RootState) => state.anime.selectedAnime
export const selectError = (state: RootState) => state.anime.error
export const selectFavoritesMap = (state: RootState) => state.anime.favorites
export const selectFavoritesList = (state: RootState) => Object.values(state.anime.favorites)
export const selectTrending = (state: RootState) => state.anime.trending
export const selectTrendingStatus = (state: RootState) => state.anime.trendingStatus
export const selectTrendingError = (state: RootState) => state.anime.trendingError
export const selectGenres = (state: RootState) => state.anime.genres
export const selectGenresStatus = (state: RootState) => state.anime.genresStatus
export const selectSelectedGenreId = (state: RootState) => state.anime.selectedGenreId
export const selectSortOrder = (state: RootState) => state.anime.sortOrder

export default animeSlice.reducer
