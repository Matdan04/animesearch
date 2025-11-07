import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-11 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'Search anime...'}
          autoFocus
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}
export default SearchBar

