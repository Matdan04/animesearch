import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAnimeSearch, fetchAnimeDetail, SearchResponse, DetailResponse } from '../../api/animeApi'
import type { RootState } from '../../app/store'
import axios from 'axios'

let searchController: AbortController | null = null
let detailController: AbortController | null = null

export const getAnimeSearch = createAsyncThunk<
  SearchResponse,
  { query: string; page: number },
  { state: RootState; rejectValue: string }
>('anime/search', async ({ query, page }, thunkAPI) => {
  try {
    if (searchController) {
      searchController.abort()
    }
    searchController = new AbortController()
    const data = await fetchAnimeSearch(query, page, 10, searchController.signal)
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
      return thunkAPI.rejectWithValue('cancelled')
    }
    return thunkAPI.rejectWithValue('Failed to fetch search results')
  } finally {
    searchController = null
  }
})

export const getAnimeDetail = createAsyncThunk<
  DetailResponse,
  { id: string | number },
  { rejectValue: string }
>('anime/detail', async ({ id }, thunkAPI) => {
  try {
    if (detailController) {
      detailController.abort()
    }
    detailController = new AbortController()
    const data = await fetchAnimeDetail(id, detailController.signal)
    return data
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
      return thunkAPI.rejectWithValue('cancelled')
    }
    return thunkAPI.rejectWithValue('Failed to fetch anime details')
  } finally {
    detailController = null
  }
})

