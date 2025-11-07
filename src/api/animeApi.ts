import axios, { AxiosInstance } from 'axios'

export interface JikanImage {
  image_url: string
  small_image_url?: string
  large_image_url?: string
  jpg?: {
    image_url: string
    small_image_url?: string
    large_image_url?: string
  }
  webp?: {
    image_url: string
    small_image_url?: string
    large_image_url?: string
  }
}

export interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      large_image_url?: string
      small_image_url?: string
    }
    webp?: {
      image_url: string
    }
  }
  score: number | null
  synopsis: string | null
  episodes: number | null
  status: string | null
  rating: string | null
  genres: { name: string }[]
}

export interface PaginationInfo {
  last_visible_page: number
  has_next_page: boolean
  items: {
    count: number
    total: number
    per_page: number
  }
}

export interface SearchResponse {
  data: Anime[]
  pagination: PaginationInfo
}

export interface DetailResponse {
  data: Anime
}

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

export const fetchAnimeSearch = async (
  query: string,
  page: number,
  limit = 10,
  signal?: AbortSignal,
): Promise<SearchResponse> => {
  const params = { q: query, page, limit }
  const res = await api.get<SearchResponse>('/anime', { params, signal })
  return res.data
}

export const fetchAnimeDetail = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<DetailResponse> => {
  const res = await api.get<DetailResponse>(`/anime/${id}`, { signal })
  return res.data
}

export default api

