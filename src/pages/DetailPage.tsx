import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import type { AppDispatch } from '../app/store'
import { getAnimeDetail } from '../features/anime/animeThunks'
import {
  selectDetailStatus,
  selectSelectedAnime,
  selectError,
  clearSelected,
} from '../features/anime/animeSlice'

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector(selectDetailStatus)
  const anime = useSelector(selectSelectedAnime)
  const error = useSelector(selectError)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(getAnimeDetail({ id }))
    }
    return () => {
      dispatch(clearSelected())
    }
  }, [id, dispatch])

  const onBack = () => navigate(-1)

  if (status === 'loading' || !anime) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/2 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-[2/3] bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="md:col-span-2 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-200">
        {error ?? 'Failed to load anime details.'}
      </div>
    )
  }

  const img =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.image_url ||
    ''

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        ← Back to Search
      </button>

      <h1 className="text-2xl font-bold">{anime.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          {img ? (
            <img
              src={img}
              alt={anime.title}
              className="w-full rounded-xl border border-slate-200 shadow-card dark:border-white/10"
            />
          ) : (
            <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800 rounded-xl" />
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          {anime.synopsis && (
            <p className="text-slate-200 leading-relaxed">{anime.synopsis}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="Episodes" value={anime.episodes ?? 'N/A'} />
            <Info label="Status" value={anime.status ?? 'N/A'} />
            <Info label="Rating" value={anime.rating ?? 'N/A'} />
            <Info label="Score" value={anime.score ?? 'N/A'} />
          </div>

          {anime.genres?.length > 0 && (
            <div>
              <div className="text-slate-600 dark:text-slate-300 text-sm mb-2">Genres</div>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map(g => (
                  <span
                    key={g.name}
                    className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs dark:bg-indigo-500/10 dark:text-indigo-200 dark:border-indigo-500/20"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Info: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="p-3 rounded-lg bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10">
    <div className="text-slate-600 dark:text-slate-400 text-xs">{label}</div>
    <div className="text-slate-900 dark:text-white font-medium">{value}</div>
  </div>
)

export default DetailPage
