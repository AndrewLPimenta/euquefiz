"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MediaItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface ProductMediaCarouselProps {
  media: MediaItem[]
  productName: string
}

export function ProductMediaCarousel({ productName, media }: ProductMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("right")

  const goToPrevious = () => {
    setDirection("left")
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection("right")
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center rounded-lg overflow-hidden">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-pulse">
            <div className="text-4xl">🎬</div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Carrossel de Mídia</p>
            <p className="text-xs text-muted-foreground">Adicionar fotos e vídeos do produto</p>
          </div>
        </div>
      </div>
    )
  }

  const currentMedia = media[currentIndex]

  return (
    <div className="relative group aspect-square overflow-hidden bg-muted rounded-lg">
      <div
        key={currentIndex}
        className={cn(
          "absolute inset-0 transition-all duration-500 ease-out",
          direction === "right" ? "animate-slideInRight" : "animate-slideInLeft",
        )}
      >
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url || "/placeholder.svg"}
            alt={`${productName} - ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              src={currentMedia.url}
              className="w-full h-full object-cover"
              controls
              poster={currentMedia.thumbnail}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm animate-pulse">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 backdrop-blur-sm z-10 shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/80 hover:bg-background hover:scale-110 backdrop-blur-sm z-10 shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? "right" : "left")
                setCurrentIndex(index)
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out",
                index === currentIndex
                  ? "bg-white w-8 shadow-lg"
                  : "bg-white/50 hover:bg-white/75 w-2 hover:w-4 hover:scale-110",
              )}
              aria-label={`Ver mídia ${index + 1}`}
            />
          ))}
        </div>
      )}

      {media.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  )
}
