// Cache for preloaded image URLs
const imageCache = new Map<string, string>()

/**
 * Preloads a context image for a phrase to improve UX
 * Returns the cached URL if available, otherwise triggers generation
 */
export async function preloadContextImage(phrase: string, emotion = "neutral"): Promise<string | null> {
  const cacheKey = `${phrase}-${emotion}`

  // Return cached URL if available
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null
  }

  try {
    // Trigger image generation in background (don't await)
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
