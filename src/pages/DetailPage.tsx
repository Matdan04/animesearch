import React from 'react'
import { useAnimeDetail } from '../hooks/useAnimeDetail'
import DetailLoadingSkeleton from '../components/DetailLoadingSkeleton'
import ErrorDisplay from '../components/ErrorDisplay'
import DetailActions from '../components/DetailActions'
import AnimeDetailContent from '../components/AnimeDetailContent'

const DetailPage: React.FC = () => {
  const {
    status,
    anime,
    error,
    isFavorite,
    handleBack,
    handleToggleFavorite,
  } = useAnimeDetail()

  if (status === 'loading' || !anime) {
    return <DetailLoadingSkeleton />
  }

  if (status === 'failed') {
    return <ErrorDisplay message={error ?? 'Failed to load anime details.'} />
  }

  return (
    <div className="space-y-6">
      <DetailActions
        isFavorite={isFavorite}
        onBack={handleBack}
        onToggleFavorite={handleToggleFavorite}
      />
      <AnimeDetailContent anime={anime} />
    </div>
  )
}

export default DetailPage
