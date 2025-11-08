import React from 'react'

interface SortControlProps {
  value: 'asc' | 'desc'
  onChange: (value: 'asc' | 'desc') => void
}

const SortControl: React.FC<SortControlProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-slate-600 dark:text-slate-300">
        Sort by rating
      </label>
      <select
        id="sort"
        className="text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-300 dark:bg-white dark:text-slate-900"
        value={value}
        onChange={e => onChange(e.target.value as 'asc' | 'desc')}
      >
        <option value="desc">Highest → Lowest</option>
        <option value="asc">Lowest → Highest</option>
      </select>
    </div>
  )
}

export default SortControl

