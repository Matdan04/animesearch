import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGenres, selectGenresStatus, selectSelectedGenreId, setSelectedGenre } from '../features/anime/animeSlice'

const CategorySidebar: React.FC = () => {
  const dispatch = useDispatch()
  const genres = useSelector(selectGenres)
  const genresStatus = useSelector(selectGenresStatus)
  const selectedGenreId = useSelector(selectSelectedGenreId)
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get selected genre name
  const selectedGenre = selectedGenreId === null 
    ? 'All' 
    : genres.find(g => g.mal_id === selectedGenreId)?.name || 'All'

  // Filter genres based on search query
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleGenreSelect = (genreId: number | null) => {
    dispatch(setSelectedGenre(genreId))
    setIsOpen(false)
    setSearchQuery('')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <aside className="md:col-span-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5 md:sticky md:top-20">
        <div className="text-sm font-semibold mb-2">Categories</div>

        {genresStatus === 'loading' && (
          <div className="h-10 rounded-lg bg-slate-200 dark:bg-white/10 animate-pulse" />
        )}

        {genresStatus === 'succeeded' && (
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 text-sm transition"
            >
              <span className="truncate">{selectedGenre}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
              <div className="absolute z-50 w-full mt-2 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-800">
                {/* Search Input */}
                <div className="p-2 border-b border-slate-200 dark:border-white/10">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-white/10 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-64 overflow-y-auto p-2">
                  {/* All option */}
                  <button
                    onClick={() => handleGenreSelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                      selectedGenreId === null
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>

                  {/* Filtered genres */}
                  {filteredGenres.length > 0 ? (
                    filteredGenres.map(genre => (
                      <button
                        key={genre.mal_id}
                        onClick={() => handleGenreSelect(genre.mal_id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                          selectedGenreId === genre.mal_id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

export default CategorySidebar

