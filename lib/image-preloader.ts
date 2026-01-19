/**
 * Image Preloader - Progressive loading with blur-up effect
 *
 * Features:
 * - Preload images on route entry
 * - Blur-up progressive loading (tiny placeholder → full image)
 * - Track loading state for UI feedback
 * - Memory-efficient with cleanup
 */

// Track loaded images
const loadedImages = new Set<string>()
const loadingImages = new Map<string, Promise<void>>()
const imageLoadCallbacks = new Map<string, Set<(loaded: boolean) => void>>()

/**
 * Preload a single image
 * Returns a promise that resolves when the image is loaded
 */
export function preloadImage(src: string): Promise<void> {
  // Already loaded
  if (loadedImages.has(src)) {
    return Promise.resolve()
  }

  // Already loading - return existing promise
  if (loadingImages.has(src)) {
    return loadingImages.get(src)!
  }

  // Start loading
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      loadedImages.add(src)
      loadingImages.delete(src)
      notifyCallbacks(src, true)
      resolve()
    }

    img.onerror = () => {
      loadingImages.delete(src)
      notifyCallbacks(src, false)
      reject(new Error(`Failed to load image: ${src}`))
    }

    img.src = src
  })

  loadingImages.set(src, promise)
  return promise
}

/**
 * Preload multiple images in parallel
 */
export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(src => preloadImage(src).catch(() => {})))
}

/**
 * Preload images with staggered timing to avoid overwhelming the browser
 */
export async function preloadImagesStaggered(
  sources: string[],
  delayMs: number = 100
): Promise<void> {
  for (const src of sources) {
    preloadImage(src).catch(() => {})
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
}

/**
 * Check if an image is already loaded
 */
export function isImageLoaded(src: string): boolean {
  return loadedImages.has(src)
}

/**
 * Check if an image is currently loading
 */
export function isImageLoading(src: string): boolean {
  return loadingImages.has(src)
}

/**
 * Subscribe to image load events
 */
export function onImageLoad(src: string, callback: (loaded: boolean) => void): () => void {
  if (!imageLoadCallbacks.has(src)) {
    imageLoadCallbacks.set(src, new Set())
  }
  imageLoadCallbacks.get(src)!.add(callback)

  // If already loaded, call immediately
  if (loadedImages.has(src)) {
    callback(true)
  }

  // Return unsubscribe function
  return () => {
    imageLoadCallbacks.get(src)?.delete(callback)
  }
}

function notifyCallbacks(src: string, loaded: boolean) {
  const callbacks = imageLoadCallbacks.get(src)
  if (callbacks) {
    callbacks.forEach(cb => cb(loaded))
  }
}

/**
 * Clear loaded images cache (for memory management)
 */
export function clearImageCache(): void {
  loadedImages.clear()
  loadingImages.clear()
  imageLoadCallbacks.clear()
}

/**
 * Get loading progress for a set of images
 */
export function getLoadingProgress(sources: string[]): {
  loaded: number
  total: number
  percentage: number
} {
  const loaded = sources.filter(src => loadedImages.has(src)).length
  return {
    loaded,
    total: sources.length,
    percentage: sources.length > 0 ? Math.round((loaded / sources.length) * 100) : 100,
  }
}

// ============================================
// BLUR-UP PROGRESSIVE LOADING
// ============================================

/**
 * Tiny base64 placeholder for blur-up effect
 * This is a 10x10 pixel blurred version that loads instantly
 */
export const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIxAAAQMDBAMBAAAAAAAAAAAAAQIDBAAFEQYSITEHE0FR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIDESH/2gAMAwEAAhEDEEA/AN0UUUFDl//Z'

/**
 * Generate a blur data URL from an image (for server-side use)
 * This creates a tiny version of the image for the blur-up effect
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  // Return generic blur placeholder
  return BLUR_PLACEHOLDER
}

/**
 * Image state for progressive loading
 */
export interface ProgressiveImageState {
  src: string
  isLoaded: boolean
  isLoading: boolean
  error: boolean
}

/**
 * Create a progressive image loader for a component
 */
export function createProgressiveLoader(src: string): {
  getState: () => ProgressiveImageState
  load: () => Promise<void>
  subscribe: (callback: () => void) => () => void
} {
  let state: ProgressiveImageState = {
    src,
    isLoaded: loadedImages.has(src),
    isLoading: loadingImages.has(src),
    error: false,
  }

  const subscribers = new Set<() => void>()

  const notify = () => {
    subscribers.forEach(cb => cb())
  }

  return {
    getState: () => state,

    load: async () => {
      if (state.isLoaded) return

      state = { ...state, isLoading: true }
      notify()

      try {
        await preloadImage(src)
        state = { ...state, isLoaded: true, isLoading: false }
      } catch {
        state = { ...state, isLoading: false, error: true }
      }
      notify()
    },

    subscribe: (callback: () => void) => {
      subscribers.add(callback)
      return () => subscribers.delete(callback)
    },
  }
}

// ============================================
// ROUTE-BASED PRELOADING
// ============================================

import { getPreloadImagesForRoute } from './image-manifest'

/**
 * Preload images for a specific route
 * Call this on route entry (e.g., in useEffect)
 */
export async function preloadRouteImages(route: string): Promise<void> {
  const images = getPreloadImagesForRoute(route)
  if (images.length > 0) {
    await preloadImagesStaggered(images, 50)
  }
}

/**
 * Hook-friendly preloader that returns loading state
 */
export function createRoutePreloader(route: string): {
  preload: () => Promise<void>
  getProgress: () => { loaded: number; total: number; percentage: number }
  isComplete: () => boolean
} {
  const images = getPreloadImagesForRoute(route)

  return {
    preload: () => preloadImagesStaggered(images, 50),
    getProgress: () => getLoadingProgress(images),
    isComplete: () => images.every(src => loadedImages.has(src)),
  }
}
