'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Image as ImageIcon, ChevronDown, X, Download } from 'lucide-react';
import { getWeddingGallery, GalleryPhoto } from '@/actions/guest-gallery';
import { getPhotoUrl } from '@/lib/photos';
import Image from 'next/image';

interface GuestGalleryProps {
  albumId: string;
  ownerClerkId: string;
  initialPageSize?: number;
  refreshKey?: number;
}

export default function GuestGallery({ 
  albumId, 
  ownerClerkId,
  initialPageSize = 20,
  refreshKey = 0
}: GuestGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const loadPhotos = useCallback(async (pageToken?: string) => {
    const isInitialLoad = !pageToken;
    
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const result = await getWeddingGallery(
        albumId, 
        ownerClerkId, 
        pageToken, 
        initialPageSize
      );

      if (result.success) {
        if (isInitialLoad) {
          setPhotos(result.photos);
        } else {
          setPhotos(prev => [...prev, ...result.photos]);
        }
        setNextPageToken(result.nextPageToken);
      } else {
        setError(result.error || 'Failed to load photos');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [albumId, ownerClerkId, initialPageSize]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, refreshKey]);

  const handleLoadMore = () => {
    if (nextPageToken && !loadingMore) {
      loadPhotos(nextPageToken);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="text-amber-500 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ImageIcon size={28} className="text-red-500" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadPhotos()}
          className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
          <ImageIcon size={28} className="text-stone-400" />
        </div>
        <h3 className="font-bold text-stone-700 mb-1">No Photos Yet</h3>
        <p className="text-sm text-stone-500">
          Be the first to upload a photo from the wedding!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <button
              onClick={() => setSelectedPhoto(photo)}
              className="aspect-square w-full relative rounded-lg overflow-hidden bg-stone-100 cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
            >
              <Image
                src={getPhotoUrl(photo.baseUrl, 400, 400, true)}
                alt={photo.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </button>
            {/* Download Button - appears on hover */}
            <a
              href={`${photo.baseUrl}=d`}
              download={photo.filename}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2 right-2 p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all z-10"
              title="Download photo"
            >
              <Download size={16} />
            </a>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {nextPageToken && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 disabled:opacity-50 transition-colors"
          >
            {loadingMore ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Load More Photos
              </>
            )}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
          
          {/* Download button in lightbox */}
          <a
            href={`${selectedPhoto.baseUrl}=d`}
            download={selectedPhoto.filename}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-16 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-2"
            title="Download full resolution"
          >
            <Download size={24} />
          </a>
          
          <div 
            className="relative max-w-4xl max-h-[80vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getPhotoUrl(selectedPhoto.baseUrl, 1200, 1200, false)}
              alt={selectedPhoto.filename}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
