import React from 'react'
import type { Anime } from '../api/animeApi'
import { Link } from 'react-router-dom'

interface Props {
  anime: Anime
}

const AnimeCard: React.FC<Props> = ({ anime }) => {
  const img =
    (anime.images?.jpg?.image_url as string | undefined) ??
    (anime.images?.webp?.image_url as string | undefined) ??
    ''

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="block group rounded-xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 dark:bg-white/5 dark:border-white/10"
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
