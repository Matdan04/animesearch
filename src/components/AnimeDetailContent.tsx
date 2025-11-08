import React from 'react'
import type { Anime } from '../api/animeApi'
import AnimeInfo from './AnimeInfo'
import { getAnimeImageUrl } from '../utils/imageHelpers'

interface AnimeDetailContentProps {
  anime: Anime
}

const AnimeDetailContent: React.FC<AnimeDetailContentProps> = ({ anime }) => {
  const imageUrl = getAnimeImageUrl(anime)

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">{anime.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
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
            <AnimeInfo label="Episodes" value={anime.episodes ?? 'N/A'} />
            <AnimeInfo label="Status" value={anime.status ?? 'N/A'} />
            <AnimeInfo label="Rating" value={anime.rating ?? 'N/A'} />
            <AnimeInfo label="Score" value={anime.score ?? 'N/A'} />
          </div>

          {anime.genres?.length > 0 && (
            <div>
              <div className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                Genres
              </div>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((g: { name: string }) => (
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

export default AnimeDetailContent

