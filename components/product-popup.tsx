// @/components/ui/product-modal-simple.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductModalSimpleProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  media?: MediaItem[];
  colors?: string[];
  sizes?: string[];
  description?: string;
  open: boolean;
  onClose: () => void;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export function ProductModalSimple({
  name = "Product",
  price = 89.99,
  originalPrice = 129.99,
  rating = 4.8,
  reviewCount = 142,
  media = [],
  colors = [],
  sizes = [],
  description = "Product description",
  open,
  onClose,
}: ProductModalSimpleProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = media[currentMediaIndex];
  const isVideo = currentMedia?.type === 'video';

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

  // NÃO bloqueia o scroll da página
  useEffect(() => {
    if (open) {
      // Apenas adiciona uma classe ao body para estilização opcional
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
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
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop fixo mas permite scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal container que se move com o scroll */}
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto pt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-background rounded-2xl shadow-2xl max-w-4xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Media section */}
                  <div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      {isVideo ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            src={currentMedia.url}
                            poster={currentMedia.thumbnail}
                            className="object-cover w-full h-full"
                            onClick={togglePlayPause}
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-background/90 backdrop-blur-sm"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <img
                          src={currentMedia?.url || "/placeholder.jpg"}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{name}</h2>
                      {rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span>{rating}</span>
                          <span className="text-muted-foreground">
                            ({reviewCount} avaliações)
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        R$ {price?.toFixed(2).replace('.', ',')}
                      </div>
                      {originalPrice && originalPrice > price && (
                        <div className="text-lg text-muted-foreground line-through">
                          R$ {originalPrice?.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Descrição</h3>
                      <p className="text-muted-foreground">{description}</p>
                    </div>

                    {colors.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Cores Disponíveis</h3>
                        <div className="flex gap-2">
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || isAddedToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Adicionando...
                        </>
                      ) : isAddedToCart ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Adicionado
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Adicionar ao Carrinho
                        </>
                      )}
                    </Button>
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