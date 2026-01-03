'use client';

import { useState } from 'react';
import { Camera, Check, Link2, AlertCircle, Loader2, ExternalLink, Plus } from 'lucide-react';
import { createWeddingAlbum, getConnectionStatus, CreateAlbumResult } from '@/actions/google-photos';
import { SignInButton, useUser } from '@clerk/nextjs';

interface AlbumManagerProps {
  albumId?: string;
  albumUrl?: string;
  onAlbumCreated: (albumId: string, shareableUrl: string) => void;
}

type Status = 'idle' | 'checking' | 'no-connection' | 'creating' | 'connected' | 'error';

export default function AlbumManager({ albumId, albumUrl, onAlbumCreated }: AlbumManagerProps) {
  const { isSignedIn } = useUser();
  const [status, setStatus] = useState<Status>(albumId ? 'connected' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState('Wedding Photos');

  const checkConnection = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      const { connected, error: connectionError } = await getConnectionStatus();
      if (connected) {
        setStatus('idle');
        setError(null);
      } else {
        setStatus('no-connection');
        setError(connectionError || null);
      }
    } catch {
      setStatus('error');
      setError('Failed to check Google connection');
    }
  };

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      setError('Please enter an album name');
      return;
    }

    setStatus('creating');
    setError(null);

    try {
      const result: CreateAlbumResult = await createWeddingAlbum(albumName);
      
      console.log('Create album result:', result);
      
      if (result.success && result.albumId) {
        setStatus('connected');
        onAlbumCreated(result.albumId, result.shareableUrl || '');
        
        if (result.error) {
          // Partial success (album created but sharing had issues)
          setError(result.error);
        }
      } else {
        setStatus('error');
        setError(result.error || 'Failed to create album');
      }
    } catch (err) {
      console.error('Error in handleCreateAlbum:', err);
      setStatus('error');
      setError('An unexpected error occurred');
    }
  };

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-stone-200 flex items-center justify-center">
            <Camera size={24} className="text-stone-400" />
          </div>
          <div>
            <h4 className="font-bold text-stone-800">Guest Photo Album</h4>
            <p className="text-sm text-stone-500">Sign in to set up photo sharing</p>
          </div>
        </div>
        <SignInButton mode="modal">
          <button className="w-full px-4 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
            Sign in to Get Started
          </button>
        </SignInButton>
      </div>
    );
  }

  // Album is connected
  if (status === 'connected' && albumId) {
    return (
      <div className="p-5 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check size={24} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-green-800">Album Connected!</h4>
            <p className="text-sm text-green-700 mt-1">
              Guests can now upload photos to your wedding album.
            </p>
            {albumUrl && (
              <a 
                href={albumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 mt-2 font-medium"
              >
                <ExternalLink size={14} />
                View Album in Google Photos
              </a>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // No Google connection
  if (status === 'no-connection') {
    return (
      <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Link2 size={24} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800">Connect Google Account</h4>
            <p className="text-sm text-amber-700 mt-1">
              You need to connect your Google account to create a photo album.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-amber-800 bg-amber-100 p-3 rounded-lg">
            <strong>How to connect:</strong><br />
            1. Click your profile picture (top right)<br />
            2. Go to &quot;Manage account&quot;<br />
            3. Connect Google with Photos access
          </p>
          
          <button
            onClick={checkConnection}
            className="w-full px-4 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
          >
            I&apos;ve Connected - Check Again
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="p-5 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-red-800">Something Went Wrong</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        
        <button
          onClick={() => setStatus('idle')}
          className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Checking connection
  if (status === 'checking') {
    return (
      <div className="p-5 bg-stone-50 rounded-xl border border-stone-200">
        <div className="flex items-center justify-center gap-3 py-4">
          <Loader2 size={24} className="text-amber-500 animate-spin" />
          <span className="text-stone-600 font-medium">Checking Google connection...</span>
        </div>
      </div>
    );
  }

  // Creating album
  if (status === 'creating') {
    return (
      <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center justify-center gap-3 py-4">
          <Loader2 size={24} className="text-amber-500 animate-spin" />
          <span className="text-amber-700 font-medium">Creating your album...</span>
        </div>
      </div>
    );
  }

  // Default: Create album form
  return (
    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Camera size={24} className="text-white" />
        </div>
        <div>
          <h4 className="font-bold text-stone-800">Guest Photo Album</h4>
          <p className="text-sm text-stone-600 mt-1">
            Create a shared album where guests can upload their photos from your wedding.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Album Name
          </label>
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="e.g., Emma & Liam's Wedding"
            className="w-full px-4 py-3 rounded-xl border border-amber-300 text-stone-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={async () => {
            // First check connection, then create if connected
            setStatus('checking');
            const { connected, error: connError } = await getConnectionStatus();
            if (connected) {
              handleCreateAlbum();
            } else {
              setStatus('no-connection');
              setError(connError || null);
            }
          }}
          className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Create Album in Google Photos
        </button>

        <p className="text-xs text-stone-500 text-center">
          This will create a new shared album in your Google Photos account
        </p>
      </div>
    </div>
  );
}
