import React from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import ThemeToggle from './components/ThemeToggle'

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 dark:text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            <span className="text-indigo-600 dark:text-indigo-400">Anime</span> Search
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://jikan.moe/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
            >
              Powered by Jikan API
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-slate-600 dark:text-slate-400 text-sm">
        Built with React + Redux Toolkit + Vite
      </footer>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
