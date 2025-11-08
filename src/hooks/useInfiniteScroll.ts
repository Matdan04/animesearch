import { useEffect, useRef } from 'react'

interface Options {
  enabled?: boolean
  rootMargin?: string
  threshold?: number
  onLoadMore: () => void
}

export const useInfiniteScroll = ({ enabled = true, rootMargin = '400px', threshold = 0, onLoadMore }: Options) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    let blocked = false
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting && !blocked) {
          blocked = true
          Promise.resolve(onLoadMore()).finally(() => {
            // small delay to avoid rapid firing
            setTimeout(() => {
              blocked = false
            }, 150)
          })
        }
      },
      { root: null, rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, rootMargin, threshold, onLoadMore])

  return { sentinelRef: ref }
}

