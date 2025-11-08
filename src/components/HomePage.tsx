import React from 'react'
import AnimeCard from './AnimeCard'
import LoadingSkeleton from './LoadingSkeleton'
import type { Anime } from '../api/animeApi'

interface HomePageProps {
  favorites: Record<string, Anime>
  trending: Anime[]
  trendingStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const HomePage: React.FC<HomePageProps> = ({ favorites, trending, trendingStatus }) => {
  return (
    <div className="space-y-4">
      <div className="text-center text-slate-600 dark:text-slate-300">
        Start typing to search for anime.
      </div>

      {/* Favorites Section */}
      {Object.keys(favorites).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Favorites</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {Object.values(favorites).map((anime: Anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Trending Now</h2>
        {trendingStatus === 'loading' && <LoadingSkeleton count={10} />}
        {trendingStatus === 'succeeded' && trending.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {trending.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

