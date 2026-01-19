import { getCommunicateButtonImage } from './image-manifest'
import { preloadImage } from './image-preloader'

// Cache for preloaded image URLs
const imageCache = new Map<string, string>()

/**
 * Preloads a context image for a phrase to improve UX
 * Returns the cached URL if available, otherwise triggers generation
 *
 * Priority:
 * 1. Pre-cached images from /public/images/ (for default buttons)
 * 2. In-memory cache
 * 3. Dynamic AI generation (for custom buttons only)
 */
export async function preloadContextImage(
  phrase: string,
  emotion = "neutral",
  buttonId?: string
): Promise<string | null> {
  const cacheKey = `${phrase}-${emotion}`

  // Return in-memory cached URL if available
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null
  }

  // Check if there's a pre-cached image for this button
  if (buttonId) {
    const cachedPath = getCommunicateButtonImage(buttonId)
    if (cachedPath) {
      // Preload the cached image
      preloadImage(cachedPath).catch(() => {})
      imageCache.set(cacheKey, cachedPath)
      return cachedPath
    }
  }

  // No cached image - trigger dynamic generation in background (for custom buttons)
  try {
    fetch("/api/generate-context-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phrase, emotion }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json()
          if (data.imageUrl) {
            imageCache.set(cacheKey, data.imageUrl)
            // Preload the actual image
            const img = new Image()
            img.src = data.imageUrl
          }
        }
      })
      .catch(() => {
        // Silently fail - preloading is best-effort
      })

    return null
  } catch {
    return null
  }
}

/**
 * Gets a cached image URL if available
 */
export function getCachedContextImage(phrase: string, emotion = "neutral"): string | null {
  const cacheKey = `${phrase}-${emotion}`
  return imageCache.get(cacheKey) || null
}

/**
 * Clears the image cache
 */
export function clearContextImageCache(): void {
  imageCache.clear()
}
