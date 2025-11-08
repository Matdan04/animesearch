import React from 'react'
import type { Anime } from '../api/animeApi'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { selectFavoritesMap, toggleFavorite } from '../features/anime/animeSlice'

interface Props {
  anime: Anime
}

const AnimeCard: React.FC<Props> = ({ anime }) => {
  const img =
    (anime.images?.jpg?.image_url as string | undefined) ??
    (anime.images?.webp?.image_url as string | undefined) ??
    ''

  const dispatch = useDispatch<AppDispatch>()
  const favorites = useSelector(selectFavoritesMap)
  const isFav = Boolean(favorites[anime.mal_id])

  const onToggleFav: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavorite(anime))
  }

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="relative block group rounded-xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 dark:bg-white/5 dark:border-white/10"
    >
      <div className="aspect-[2/3] overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={anime.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <button
          onClick={onToggleFav}
          className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/90 text-red-500 hover:bg-white shadow border border-slate-200 transition dark:bg-slate-900/70 dark:border-white/10"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 5.01 10.72 6.53 11.53 5.01 13.2 4 14.94 4 17.44 4 19.44 6 19.44 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
          {anime.title}
        </h3>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          Score: {anime.score ?? 'N/A'}
        </div>
        <div className="mt-3 text-indigo-600 dark:text-indigo-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View details →
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard
