"use client"

import { useState, useEffect } from "react"
import { useProgressiveImage, useImagePreloader } from "@/hooks/use-progressive-image"
import { BLUR_PLACEHOLDER, isImageLoaded, preloadImage } from "@/lib/image-preloader"
import {
  STORY_MODE_IMAGES,
  PRACTICE_IMAGES,
  STORIES_IMAGES,
  COMMUNICATE_IMAGES,
} from "@/lib/image-manifest"
import { cn } from "@/lib/utils"
import { Check, X, Loader2, RefreshCw, Image as ImageIcon } from "lucide-react"

interface ImageStatus {
  path: string
  name: string
  category: string
  status: 'pending' | 'loading' | 'loaded' | 'error'
  loadTime?: number
}

function ImageCard({ image }: { image: ImageStatus }) {
  const { src, isLoaded, isLoading, error } = useProgressiveImage(
    image.status === 'loaded' || image.status === 'loading' ? image.path : null
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        {image.status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
        )}
        {(image.status === 'loading' || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        {image.status === 'error' || error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50">
            <X className="w-8 h-8 text-red-400" />
            <span className="text-xs text-red-500 mt-1">Missing</span>
          </div>
        ) : (
          <>
            {/* Blur placeholder */}
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-300",
                isLoaded ? "opacity-0" : "opacity-100"
              )}
              style={{
                backgroundImage: `url(${BLUR_PLACEHOLDER})`,
                filter: 'blur(10px)',
              }}
            />
            {/* Actual image */}
            {(image.status === 'loaded' || image.status === 'loading') && (
              <img
                src={image.path}
                alt={image.name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </>
        )}
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium truncate flex-1" title={image.name}>
            {image.name}
          </span>
          {image.status === 'loaded' && isLoaded && (
            <Check className="w-4 h-4 text-green-500 flex-shrink-0 ml-1" />
          )}
          {(image.status === 'error' || error) && (
            <X className="w-4 h-4 text-red-500 flex-shrink-0 ml-1" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">{image.category}</span>
        {image.loadTime && (
          <span className="text-xs text-muted-foreground ml-2">{image.loadTime}ms</span>
        )}
      </div>
    </div>
  )
}

export default function TestImagesPage() {
  const [images, setImages] = useState<ImageStatus[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [isTestRunning, setIsTestRunning] = useState(false)

  // Gather all images from manifest
  useEffect(() => {
    const allImages: ImageStatus[] = []

    // Story Mode thumbnails
    Object.entries(STORY_MODE_IMAGES.thumbnails).forEach(([name, path]) => {
      allImages.push({ path, name: `thumb-${name}`, category: 'story-mode', status: 'pending' })
    })

    // Story Mode panels
    Object.entries(STORY_MODE_IMAGES.panels).forEach(([storyName, panels]) => {
      panels.forEach((path, idx) => {
        allImages.push({ path, name: `${storyName}-panel-${idx + 1}`, category: 'story-mode', status: 'pending' })
      })
    })

    // Practice scenarios
    PRACTICE_IMAGES.scenarios.forEach(scenario => {
      allImages.push({ path: scenario.image, name: scenario.id, category: 'practice', status: 'pending' })
    })

    // Stories/Watch scenarios
    Object.entries(STORIES_IMAGES.scenarios).forEach(([name, data]) => {
      allImages.push({ path: data.thumbnail, name: `${name}-thumb`, category: 'stories', status: 'pending' })
      data.scenes.forEach((scene, idx) => {
        allImages.push({ path: scene, name: `${name}-scene-${idx + 1}`, category: 'stories', status: 'pending' })
      })
    })

    // Communicate buttons
    Object.entries(COMMUNICATE_IMAGES.buttons).forEach(([name, path]) => {
      allImages.push({ path, name, category: 'communicate', status: 'pending' })
    })

    setImages(allImages)
  }, [])

  const runLoadTest = async () => {
    setIsTestRunning(true)

    // Reset all to pending
    setImages(prev => prev.map(img => ({ ...img, status: 'pending', loadTime: undefined })))

    // Filter images to test
    const toTest = filter === 'all' ? images : images.filter(img => img.category === filter)

    for (const image of toTest) {
      const startTime = Date.now()

      setImages(prev => prev.map(img =>
        img.path === image.path ? { ...img, status: 'loading' } : img
      ))

      try {
        await preloadImage(image.path)
        const loadTime = Date.now() - startTime

        setImages(prev => prev.map(img =>
          img.path === image.path ? { ...img, status: 'loaded', loadTime } : img
        ))
      } catch {
        setImages(prev => prev.map(img =>
          img.path === image.path ? { ...img, status: 'error' } : img
        ))
      }
    }

    setIsTestRunning(false)
  }

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter)
  const stats = {
    total: filteredImages.length,
    loaded: filteredImages.filter(i => i.status === 'loaded').length,
    errors: filteredImages.filter(i => i.status === 'error').length,
    pending: filteredImages.filter(i => i.status === 'pending').length,
  }

  const categories = ['all', 'story-mode', 'practice', 'stories', 'communicate']

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Image Loading Test</h1>
          <p className="text-muted-foreground">
            Test cached images with progressive blur-up loading
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    filter === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={runLoadTest}
              disabled={isTestRunning}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors",
                isTestRunning
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {isTestRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isTestRunning ? 'Testing...' : 'Run Load Test'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-foreground">{stats.total}</span>
              <span className="text-sm text-muted-foreground ml-1">Total</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-green-500">{stats.loaded}</span>
              <span className="text-sm text-muted-foreground ml-1">Loaded</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-500">{stats.errors}</span>
              <span className="text-sm text-muted-foreground ml-1">Missing</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-400">{stats.pending}</span>
              <span className="text-sm text-muted-foreground ml-1">Pending</span>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <ImageCard key={image.path} image={image} />
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-muted-foreground">No images in this category</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-3">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Click "Run Load Test" to test all images in the current filter</li>
            <li>Green checkmarks indicate successfully loaded images</li>
            <li>Red X marks indicate missing images that need to be generated</li>
            <li>Watch the blur-up progressive loading effect in action</li>
            <li>Load times are displayed for performance monitoring</li>
          </ol>

          <h3 className="text-md font-semibold mt-6 mb-2">Missing Images</h3>
          <p className="text-muted-foreground text-sm">
            If images show as missing, they need to be generated using the AI image generation
            script and placed in the appropriate <code>/public/images/</code> subdirectory.
            Run <code>npx ts-node scripts/generate-image-list.ts</code> to see the full
            manifest of images needed with their AI generation prompts.
          </p>
        </div>
      </div>
    </div>
  )
}
