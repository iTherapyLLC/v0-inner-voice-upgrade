// Client-side cache for context images
// Images are expensive to generate, so we cache aggressively

const LOCAL_STORAGE_KEY = "innervoice-context-images"

interface CachedImage {
  url: string
  timestamp: number
}

// Cache expires after 7 days
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000

const pendingRequests = new Set<string>()

export function getCachedImage(phrase: string): string | null {
  if (typeof window === "undefined") return null

  try {
    const cache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")
    const key = phrase.toLowerCase().trim()
    const cached = cache[key] as CachedImage | undefined

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url
    }

    // Clean up expired entry
    if (cached) {
      delete cache[key]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache))
    }

    return null
  } catch {
    return null
  }
}

export function setCachedImage(phrase: string, url: string): void {
  if (typeof window === "undefined") return

  try {
    const cache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}")
    const key = phrase.toLowerCase().trim()

    cache[key] = {
      url,
      timestamp: Date.now(),
    }

    // Limit cache size to 100 images
    const keys = Object.keys(cache)
    if (keys.length > 100) {
      // Remove oldest entries
      const sorted = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp)
      for (let i = 0; i < keys.length - 100; i++) {
        delete cache[sorted[i]]
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Storage might be full, ignore
  }
}

export function preloadContextImage(phrase: string, emotion?: string): void {
  const key = phrase.toLowerCase().trim()

  // Check if already cached
  if (getCachedImage(phrase)) return

  // Check if request already in flight
  if (pendingRequests.has(key)) return
  pendingRequests.add(key)

  // Generate in background
  fetch("/api/generate-context-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phrase, emotion }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed")
      return res.json()
    })
    .then((data) => {
      if (data.imageUrl) {
        setCachedImage(phrase, data.imageUrl)
      }
    })
    .catch(() => {
      // Silent fail - context images are enhancement, not required
    })
    .finally(() => {
      pendingRequests.delete(key)
    })
}

export function preloadContextImages(phrases: Array<{ text: string; emotion?: string }>): void {
  phrases.forEach((phrase, index) => {
    // Stagger requests by 500ms to avoid overwhelming the API
    setTimeout(() => {
      preloadContextImage(phrase.text, phrase.emotion)
    }, index * 500)
  })
}
