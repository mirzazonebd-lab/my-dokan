'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X, Expand } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  // Fallback if only one image
  const allImages = images.length > 0 ? images : [
    'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !zoom) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, [zoom]);

  const prev = () => setActiveIndex(i => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIndex(i => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <>
      {/* Main Container */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div
          ref={imgRef}
          className="relative aspect-square rounded-2xl overflow-hidden bg-rose-50 cursor-zoom-in select-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => { setZoom(false); setMousePos({ x: 50, y: 50 }); }}
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={allImages[activeIndex]}
            alt={productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={
              zoom
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: 'scale(2)',
                    transition: 'transform 0.1s ease-out',
                  }
                : { transform: 'scale(1)', transition: 'transform 0.3s ease-out' }
            }
          />

          {/* Zoom hint */}
          {!zoom && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg pointer-events-none">
              <ZoomIn size={12} />
              Hover to zoom
            </div>
          )}

          {/* Expand button */}
          <button
            onClick={e => { e.stopPropagation(); setLightboxOpen(true); }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white shadow-sm transition-colors z-10"
            aria-label="Expand image"
          >
            <Expand size={16} className="text-gray-600" />
          </button>

          {/* Nav arrows (only if multiple images) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIndex
                    ? 'border-[#C4818A] shadow-rose'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-rose-200'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators */}
        {allImages.length > 1 && (
          <div className="flex justify-center gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex ? 'w-5 h-1.5 bg-[#C4818A]' : 'w-1.5 h-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                onClick={e => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                onClick={e => { e.stopPropagation(); next(); }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-2xl max-h-[80vh] aspect-square mx-4"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={allImages[activeIndex]}
              alt={productName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          {/* Lightbox Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIndex ? 'border-white' : 'border-white/20 opacity-50'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
