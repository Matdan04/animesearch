import React from 'react'

interface AnimeInfoProps {
  label: string
  value: React.ReactNode
}

const AnimeInfo: React.FC<AnimeInfoProps> = ({ label, value }) => (
  <div className="p-3 rounded-lg bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10">
    <div className="text-slate-600 dark:text-slate-400 text-xs">{label}</div>
    <div className="text-slate-900 dark:text-white font-medium">{value}</div>
  </div>
)

export default AnimeInfo

