"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Play,

  Pause,
  Volume2,
  VolumeX,
  X,
  Share2,
  Maximize2,
} from "lucide-react";
import Image from "next/image";

export interface ProductModalProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  media?: MediaItem[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  freeShipping?: boolean;
  description?: string;
  open: boolean;
  onClose: () => void;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export function ProductModal({
  name = "Premium Wool Sweater",
  price = 89.99,
  originalPrice = 129.99,
  rating = 4.8,
  reviewCount = 142,
  media = [
    { type: 'image', url: "/logo.svg" },
    { type: 'video', url: "/sample-video.mp4", thumbnail: "/video-thumbnail.jpg" },
    { type: 'image', url: "/logo.svg" },
  ],
  colors = ["#1e293b", "#a855f7", "#0ea5e9", "#84cc16"],
  sizes = ["XS", "S", "M", "L", "XL"],
  isNew = true,
  isBestSeller = true,
  discount = 30,
  freeShipping = true,
  description = "Product description goes here",
  open,
  onClose,
}: ProductModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentMedia = media[currentMediaIndex] ?? media[0]
  const isVideo = currentMedia?.type === 'video'

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleAddToCart = () => {
    if (isAddedToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 800);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => { })
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }



  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!modalRef.current) return;

    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVideoEnded = () => {
    if (!videoRef.current) return

    videoRef.current.currentTime = 0
    videoRef.current.play().catch(() => { })
    setIsPlaying(true)
  }


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };


  useEffect(() => {
    if (open && media.length > 0) {
      setCurrentMediaIndex(0)
      setIsPlaying(false)
    }
  }, [open, media])

  if (!media || media.length === 0) {
    media = [{ type: "image", url: "/placeholder.jpg" }]
  }

  useEffect(() => {
    if (!open || !isVideo || !videoRef.current) return

    const video = videoRef.current

    video.currentTime = 0
    video.muted = true

    video.play().catch(() => { })
    setIsPlaying(true)
  }, [open, currentMediaIndex, isVideo])


  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-background rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"

              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="grid md:grid-cols-2 h-full min-h-0">

                {/* Left side - Media */}
                <div className="relative bg-muted/30">
                  <div className="relative aspect-square overflow-hidden">
                    {isVideo ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={currentMedia.url}
                          poster={currentMedia.thumbnail}
                          className="object-cover w-full h-full cursor-pointer"
                          muted
                          playsInline
                          autoPlay
                          preload="auto"
                          onEnded={handleVideoEnded}
                          onClick={togglePlayPause}
                        />



                        {/* Video controls */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 via-transparent to-transparent">




                          {/* Additional controls */}
                          <div className="absolute bottom-4 right-4 flex gap-2">


                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.img
                        key={currentMediaIndex}
                        src={currentMedia.url}
                        alt={`${name} - View ${currentMediaIndex + 1}`}
                        className="object-cover w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Navigation arrows */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-text/80 backdrop-blur-sm shadow-lg"
                        onClick={prevMedia}
                      >
                        <ChevronLeft className="h-5 w-5 " />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-text/80  backdrop-blur-sm shadow-lg"
                        onClick={nextMedia}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Media indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {media.map((item, index) => (
                        <button
                          key={index}
                          className={`flex items-center justify-center transition-all ${index === currentMediaIndex
                              ? item.type === 'video'
                                ? "bg-purple-500 w-6 h-2 rounded-full"
                                : "bg-primary w-6 h-2 rounded-full"
                              : "bg-primary/30 w-2 h-2 rounded-full"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isVideo && videoRef.current) {
                              videoRef.current.pause();
                              setIsPlaying(false);
                            }
                            setCurrentMediaIndex(index);
                          }}
                        >

                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {media.map((item, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentMediaIndex
                              ? "border-primary"
                              : "border-transparent hover:border-primary/50"
                            }`}
                          onClick={() => {
                            if (isVideo && videoRef.current) {
                              videoRef.current.pause();
                              setIsPlaying(false);
                            }
                            setCurrentMediaIndex(index);
                          }}
                        >
                          {item.type === 'video' ? (
                            <div className="relative w-full h-full bg-black">
                              <img
                                src={item.thumbnail || item.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover opacity-60"
                              />
                              <Play className="absolute inset-0 m-auto h-6 w-6 text-white" />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex flex-col p-6 md:p-8 overflow-y-auto min-h-0">

                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {isNew && (
                        <Badge className="bg-primary/40 border-primary px-4">New</Badge>
                      )}
                      {isBestSeller && (
                        <Badge className="bg-primary/40 border-primary px-4">Best Seller</Badge>
                      )}
                      {discount > 0 && (
                        <Badge className="bg-primary/40 border-primary px-4">-{discount}%</Badge>
                      )}
                      {freeShipping && (
                        <Badge className="bg-primary/40 border-primary px-4">Free Shipping</Badge>
                      )}
                    </div>

                    {/* Title and rating */}
                    <div className="mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{name}</h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="ml-1 font-medium">{rating}</span>
                          <span className="ml-1 text-muted-foreground">
                            ({reviewCount} avaliações)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 border border-primary/40 hover:bg-primary/10"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                        {originalPrice > price && (
                          <>
                            <span className="text-lg text-muted-foreground line-through">
                              ${originalPrice.toFixed(2)}
                            </span>
                            <Badge variant="outline" className="text-rose-500">
                              - ${(originalPrice - price).toFixed(2)}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Colors */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Colors</h3>
                      <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className={`flex flex-col items-center gap-2 ${selectedColor === color ? 'font-medium' : ''
                              }`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <div
                              className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-muted hover:border-primary"
                                }`}
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs">{color}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="mb-8">
                      <h3 className="font-semibold mb-3">Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            className={`px-4 py-2 rounded-lg border transition-all ${selectedSize === size
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-muted hover:border-primary hover:bg-muted"
                              }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || isAddedToCart}
                      >
                        {isAddingToCart ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Adding...
                          </>
                        ) : isAddedToCart ? (
                          <>
                            <Check className="mr-2 h-5 w-5" />
                            Adicionado!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            R$ {price.toFixed(2)}
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-12 w-12 rounded-full ${isWishlisted ? "text-rose-500 border-rose-500" : ""
                          }`}
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart
                          className={`h-5 w-5 ${isWishlisted ? "fill-rose-500" : ""
                            }`}
                        />
                      </Button>
                    </div>

                    {/* <div className="text-center">
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        *Confira a disponibilidade de entregas*
                      </button>
                      <span className="mx-2">•</span>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        🚚 Free shipping
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}