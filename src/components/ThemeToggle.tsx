import React from 'react'
import { useTheme } from '../hooks/useTheme'

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white transition"
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {theme === 'dark' ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-300">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-500">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.536-6.464-1.414 1.414M6.95 17.05l-1.414 1.414m0-12.728 1.414 1.414m12.728 0-1.414 1.414" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle

