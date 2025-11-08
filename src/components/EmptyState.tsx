import React from 'react'

interface EmptyStateProps {
  message: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center text-slate-300">
      {message}
    </div>
  )
}

export default EmptyState

