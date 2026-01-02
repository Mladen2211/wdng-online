'use client';

import { useState } from 'react';
import { Image as ImageIcon, Check, Link2, AlertCircle, RefreshCw, ExternalLink, Plus, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { getAlbums, hasGoogleConnection, GoogleAlbum } from '@/actions/google-photos';
import { SignInButton, useUser } from '@clerk/nextjs';

interface AlbumSelectorProps {
  selectedAlbumId?: string;
  selectedAlbumTitle?: string;
  onSelect: (albumId: string, albumTitle: string) => void;
}

export default function AlbumSelector({ selectedAlbumId, selectedAlbumTitle, onSelect }: AlbumSelectorProps) {
  const { isSignedIn } = useUser();
  const [albums, setAlbums] = useState<GoogleAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasConnection, setHasConnection] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);

  const checkConnectionAndLoadAlbums = async () => {
    if (!isSignedIn) return;
    
    setLoading(true);
    setError(null);

    try {
      const connected = await hasGoogleConnection();
      setHasConnection(connected);

      if (connected) {
        const albumList = await getAlbums();
        setAlbums(albumList);
        if (albumList.length === 0) {
          setError("no_albums");
        }
      }
    } catch (err) {
      console.error("Failed to load albums:", err);
      setError("Failed to load albums. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlbum = (album: GoogleAlbum) => {
    onSelect(album.id, album.title);
    setShowAlbumPicker(false);
  };

  const openGooglePhotos = () => {
    window.open('https://photos.google.com/albums', '_blank');
  };

  // Not signed in - show simple prompt
  if (!isSignedIn) {
    return (
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center">
            <ImageIcon size={20} className="text-stone-400" />
          </div>
          <div>
            <h4 className="font-medium text-stone-800 text-sm">Guest Photo Album</h4>
            <p className="text-xs text-stone-500">Sign in to connect your Google Photos</p>
          </div>
        </div>
        <SignInButton mode="modal">
          <button className="w-full px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
            Sign in to Connect Album
          </button>
        </SignInButton>
      </div>
    );
  }

  // Album is selected - show connected state
  if (selectedAlbumId && !showAlbumPicker) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check size={20} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-green-800 text-sm">Album Connected</h4>
            <p className="text-sm text-green-700 truncate">{selectedAlbumTitle || 'Selected Album'}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => {
              checkConnectionAndLoadAlbums();
              setShowAlbumPicker(true);
            }}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Change Album
          </button>
          <a 
            href="https://photos.google.com/albums"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white text-green-700 border border-green-300 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  // Show "Select Album" button when no album is selected
  if (!showAlbumPicker) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <FolderOpen size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-amber-800 text-sm">Guest Photo Album</h4>
            <p className="text-xs text-amber-700">Choose where guests upload photos</p>
          </div>
        </div>
        <button 
          onClick={() => {
            checkConnectionAndLoadAlbums();
            setShowAlbumPicker(true);
          }}
          className="w-full px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon size={16} /> Select Google Photos Album
        </button>
      </div>
    );
  }

  // Album picker is open
  return (
    <div className="p-4 bg-white rounded-xl border-2 border-amber-300 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-stone-800">Select Album</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={checkConnectionAndLoadAlbums}
            disabled={loading}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh albums"
          >
            <RefreshCw size={16} className={`text-stone-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAlbumPicker(false)}
            className="text-xs text-stone-500 hover:text-stone-700"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-sm text-stone-600">Loading albums...</span>
        </div>
      )}

      {/* No Google connection */}
      {!loading && hasConnection === false && (
        <div className="text-center py-6">
          <Link2 size={32} className="mx-auto mb-3 text-amber-500" />
          <h5 className="font-medium text-stone-800 mb-1">Connect Google Account</h5>
          <p className="text-sm text-stone-500 mb-4">
            Link your Google account to access your albums
          </p>
          <p className="text-xs text-stone-400 mb-4">
            Go to your profile settings and connect Google with Photos access
          </p>
          <button
            onClick={checkConnectionAndLoadAlbums}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600"
          >
            Check Connection
          </button>
        </div>
      )}

      {/* Error state */}
      {!loading && error && error !== "no_albums" && (
        <div className="text-center py-6">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
          <h5 className="font-medium text-red-800 mb-1">Something went wrong</h5>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={checkConnectionAndLoadAlbums}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No albums found */}
      {!loading && hasConnection && error === "no_albums" && (
        <div className="text-center py-6">
          <ImageIcon size={32} className="mx-auto mb-3 text-stone-400" />
          <h5 className="font-medium text-stone-800 mb-1">No Albums Found</h5>
          <p className="text-sm text-stone-500 mb-4">
            Create an album in Google Photos first
          </p>
          <button
            onClick={openGooglePhotos}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} /> Create Album in Google Photos
          </button>
        </div>
      )}

      {/* Albums list */}
      {!loading && hasConnection && albums.length > 0 && (
        <>
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => handleSelectAlbum(album)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                  selectedAlbumId === album.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                {/* Album thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                  {album.coverPhotoBaseUrl ? (
                    <Image 
                      src={`${album.coverPhotoBaseUrl}=w100-h100`}
                      alt={album.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-stone-300" />
                    </div>
                  )}
                </div>

                {/* Album info */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm text-stone-800 truncate">{album.title}</h5>
                  <p className="text-xs text-stone-500">{album.mediaItemsCount || 0} photos</p>
                </div>

                {/* Selected indicator */}
                {selectedAlbumId === album.id && (
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Create new album option */}
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={openGooglePhotos}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Create New Album in Google Photos
            </button>
            <p className="text-xs text-stone-400 text-center mt-2">
              After creating, click refresh to see it here
            </p>
          </div>
        </>
      )}
    </div>
  );
}
