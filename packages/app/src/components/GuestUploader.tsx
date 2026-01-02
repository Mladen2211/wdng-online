'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { uploadPhoto } from '@/actions/guest-upload';
import Image from 'next/image';

interface GuestUploaderProps {
  albumId: string;
  ownerClerkId: string;
  siteId: string;
  maxUploads?: number;
}

interface FilePreview {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const STORAGE_KEY_PREFIX = 'wdng_upload_count_';

export default function GuestUploader({ 
  albumId, 
  ownerClerkId, 
  siteId,
  maxUploads = 25 
}: GuestUploaderProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${siteId}`);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingUploads = maxUploads - uploadCount;
  const canUpload = remainingUploads > 0;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Limit to remaining uploads
    const limitedFiles = selectedFiles.slice(0, remainingUploads - files.length);
    
    const newPreviews: FilePreview[] = limitedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newPreviews]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [remainingUploads, files.length]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const filePreview = files[i];
      if (filePreview.status !== 'pending') continue;

      // Update status to uploading
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[i] = { ...newFiles[i], status: 'uploading' };
        return newFiles;
      });

      try {
        // Convert file to ArrayBuffer
        const arrayBuffer = await filePreview.file.arrayBuffer();
        
        const result = await uploadPhoto(
          arrayBuffer,
          filePreview.file.name,
          albumId,
          ownerClerkId
        );

        if (result.success) {
          successCount++;
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], status: 'success' };
            return newFiles;
          });
        } else {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], status: 'error', error: result.error };
            return newFiles;
          });
        }
      } catch {
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i] = { ...newFiles[i], status: 'error', error: 'Upload failed' };
          return newFiles;
        });
      }
    }

    // Update localStorage count
    const newCount = uploadCount + successCount;
    setUploadCount(newCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${siteId}`, String(newCount));
    }

    setIsUploading(false);

    // Clear successful uploads after a delay
    setTimeout(() => {
      setFiles(prev => prev.filter(f => f.status !== 'success'));
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );

    const limitedFiles = droppedFiles.slice(0, remainingUploads - files.length);

    const newPreviews: FilePreview[] = limitedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newPreviews]);
  }, [remainingUploads, files.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Upload limit reached
  if (!canUpload && files.length === 0) {
    return (
      <div className="p-6 bg-stone-100 rounded-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-stone-200 rounded-full flex items-center justify-center">
          <Check size={24} className="text-stone-500" />
        </div>
        <h3 className="font-bold text-stone-700 mb-1">Thank you!</h3>
        <p className="text-sm text-stone-500">
          You&apos;ve uploaded {uploadCount} photos. Maximum limit reached.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center hover:border-amber-400 hover:bg-amber-50/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
          <Upload size={28} className="text-amber-600" />
        </div>
        
        <h3 className="font-bold text-stone-800 mb-1">Upload Your Photos</h3>
        <p className="text-sm text-stone-500 mb-3">
          Drag and drop photos here, or click to select
        </p>
        <p className="text-xs text-stone-400">
          {remainingUploads} uploads remaining
        </p>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {files.map((filePreview, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
                <Image
                  src={filePreview.preview}
                  alt={filePreview.file.name}
                  fill
                  className="object-cover"
                />
                
                {/* Status overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  filePreview.status === 'pending' ? 'bg-black/0 group-hover:bg-black/40' :
                  filePreview.status === 'uploading' ? 'bg-black/50' :
                  filePreview.status === 'success' ? 'bg-green-500/70' :
                  'bg-red-500/70'
                }`}>
                  {filePreview.status === 'pending' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {filePreview.status === 'uploading' && (
                    <Loader2 size={24} className="text-white animate-spin" />
                  )}
                  {filePreview.status === 'success' && (
                    <Check size={24} className="text-white" />
                  )}
                  {filePreview.status === 'error' && (
                    <AlertCircle size={24} className="text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {files.some(f => f.status === 'pending') && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload {files.filter(f => f.status === 'pending').length} Photo{files.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
