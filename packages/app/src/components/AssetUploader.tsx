'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { uploadAsset } from '@/actions/assets';

interface AssetUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free';
  className?: string;
  persistToServer?: boolean; // If true, upload to server; if false, use data URL
}

export default function AssetUploader({
  value,
  onChange,
  label = 'Upload Image',
  aspectRatio = 'free',
  className = '',
  persistToServer = true
}: AssetUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    free: 'min-h-[150px]'
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      if (persistToServer) {
        // Upload to server and get persistent URL
        const formData = new FormData();
        formData.append('file', file);
        
        const result = await uploadAsset(formData);
        
        if (result.success && result.url) {
          onChange(result.url);
        } else {
          setError(result.error || 'Failed to upload image');
        }
      } else {
        // Use base64 data URL (not persisted)
        const dataUrl = await fileToDataUrl(file);
        onChange(dataUrl);
      }
    } catch (err) {
      setError('Failed to process image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, persistToServer]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        onClick={() => !value && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed transition-all
          ${aspectRatioClasses[aspectRatio]}
          ${value ? 'border-transparent' : 'border-gray-300 hover:border-rose-400'}
          ${isDragging ? 'border-rose-500 bg-rose-50' : 'bg-gray-50'}
          ${!value ? 'cursor-pointer' : ''}
        `}
      >
        {value ? (
          <div className="relative w-full h-full min-h-[150px]">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-2 bg-white text-gray-800 rounded-lg mr-2 text-sm font-medium hover:bg-gray-100"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-300 border-t-rose-600 mb-2" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  {isDragging ? 'Drop image here' : 'Click or drag to upload'}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
