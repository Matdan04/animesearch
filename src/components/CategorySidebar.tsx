import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGenres, selectGenresStatus, selectSelectedGenreId, setSelectedGenre } from '../features/anime/animeSlice'

const CategorySidebar: React.FC = () => {
  const dispatch = useDispatch()
  const genres = useSelector(selectGenres)
  const genresStatus = useSelector(selectGenresStatus)
  const selectedGenreId = useSelector(selectSelectedGenreId)

  const handleGenreSelect = (genreId: number | null) => {
    dispatch(setSelectedGenre(genreId))
  }

  return (
    <aside className="md:col-span-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5 md:sticky md:top-20">
        <div className="text-sm font-semibold mb-2">Categories</div>

        {genresStatus === 'loading' && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded bg-slate-200 dark:bg-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {genresStatus === 'succeeded' && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleGenreSelect(null)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                selectedGenreId === null
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200'
              }`}
            >
              All
            </button>
            {genres.map(genre => (
              <button
                key={genre.mal_id}
                onClick={() => handleGenreSelect(genre.mal_id)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                  selectedGenreId === genre.mal_id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default CategorySidebar

