import React from 'react'

interface ErrorDisplayProps {
  message: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-200">
      {message}
    </div>
  )
}

export default ErrorDisplay

