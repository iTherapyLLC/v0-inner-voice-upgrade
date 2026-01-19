"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  preloadImage,
  isImageLoaded,
  onImageLoad,
  BLUR_PLACEHOLDER,
  preloadRouteImages,
  getLoadingProgress,
} from '@/lib/image-preloader'
import { getPreloadImagesForRoute } from '@/lib/image-manifest'

/**
 * Hook for progressive image loading with blur-up effect
 *
 * Usage:
 * const { src, isLoaded, isLoading } = useProgressiveImage('/images/my-image.jpg')
 *
 * <img
 *   src={src}
 *   className={isLoaded ? 'opacity-100' : 'opacity-0'}
 *   style={{ filter: isLoaded ? 'none' : 'blur(20px)' }}
 * />
 */
export function useProgressiveImage(imageSrc: string | null | undefined) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!imageSrc) {
      setIsLoaded(false)
      setIsLoading(false)
      setError(false)
      return
    }

    // Check if already loaded
    if (isImageLoaded(imageSrc)) {
      setIsLoaded(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(false)

    // Subscribe to load events
    const unsubscribe = onImageLoad(imageSrc, (loaded) => {
      setIsLoaded(loaded)
      setIsLoading(false)
      if (!loaded) setError(true)
    })

    // Start loading
    preloadImage(imageSrc).catch(() => {
      setError(true)
      setIsLoading(false)
    })

    return unsubscribe
  }, [imageSrc])

  return {
    src: imageSrc || BLUR_PLACEHOLDER,
    blurSrc: BLUR_PLACEHOLDER,
    isLoaded,
    isLoading,
    error,
  }
}

/**
 * Hook to preload images when entering a route
 *
 * Usage:
 * const { isComplete, progress } = useRoutePreload('/practice')
 */
export function useRoutePreload(route: string) {
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percentage: 0 })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const images = getPreloadImagesForRoute(route)

    if (images.length === 0) {
      setIsComplete(true)
      setProgress({ loaded: 0, total: 0, percentage: 100 })
      return
    }

    // Update progress periodically
    const updateProgress = () => {
      const newProgress = getLoadingProgress(images)
      setProgress(newProgress)
      setIsComplete(newProgress.percentage === 100)
    }

    // Start preloading
    preloadRouteImages(route).then(updateProgress)

    // Poll for progress updates
    const interval = setInterval(updateProgress, 100)

    return () => clearInterval(interval)
  }, [route])

  return { isComplete, progress }
}

/**
 * Hook for managing a single cached image with fallback to dynamic generation
 *
 * Usage:
 * const { imageSrc, isLoading } = useCachedImage(cachedPath, generateFallback)
 */
export function useCachedImage(
  cachedPath: string | null,
  fallbackGenerator?: () => Promise<string | null>
) {
  const [imageSrc, setImageSrc] = useState<string | null>(cachedPath)
  const [isLoading, setIsLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const progressive = useProgressiveImage(imageSrc)

  useEffect(() => {
    if (!cachedPath) {
      // No cached path - use fallback generator if available
      if (fallbackGenerator && !usedFallback) {
        setIsLoading(true)
        setUsedFallback(true)
        fallbackGenerator()
          .then((url) => {
            if (url) setImageSrc(url)
          })
          .finally(() => setIsLoading(false))
      }
      return
    }

    // Try to load cached image
    setIsLoading(true)
    preloadImage(cachedPath)
      .then(() => {
        setImageSrc(cachedPath)
        setIsLoading(false)
      })
      .catch(() => {
        // Cached image failed - try fallback
        if (fallbackGenerator && !usedFallback) {
          setUsedFallback(true)
          fallbackGenerator()
            .then((url) => {
              if (url) setImageSrc(url)
            })
            .finally(() => setIsLoading(false))
        } else {
          setIsLoading(false)
        }
      })
  }, [cachedPath, fallbackGenerator, usedFallback])

  return {
    imageSrc,
    isLoading: isLoading || progressive.isLoading,
    isLoaded: progressive.isLoaded,
    error: progressive.error,
    blurSrc: BLUR_PLACEHOLDER,
  }
}

/**
 * Hook for preloading multiple images with progress tracking
 */
export function useImagePreloader(images: string[]) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const preload = useCallback(async () => {
    setLoadedCount(0)
    setIsComplete(false)

    for (const src of images) {
      try {
        await preloadImage(src)
        setLoadedCount(prev => prev + 1)
      } catch {
        // Continue loading other images even if one fails
        setLoadedCount(prev => prev + 1)
      }
    }

    setIsComplete(true)
  }, [images])

  useEffect(() => {
    if (images.length > 0) {
      preload()
    } else {
      setIsComplete(true)
    }
  }, [images, preload])

  return {
    loadedCount,
    totalCount: images.length,
    percentage: images.length > 0 ? Math.round((loadedCount / images.length) * 100) : 100,
    isComplete,
    preload,
  }
}
