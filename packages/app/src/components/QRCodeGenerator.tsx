'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Copy, Check, X, QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  subdomain: string;
  onClose?: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ subdomain, onClose }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  const siteUrl = `https://${subdomain}.wdng.online`;
  // For development, use local URL
  const devUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/sites/${subdomain}`
    : `/sites/${subdomain}`;
  
  const displayUrl = process.env.NODE_ENV === 'production' ? siteUrl : devUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas to draw the QR code with white background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1024; // High resolution
    const padding = 64;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size);
      
      // Download
      const link = document.createElement('a');
      link.download = `${subdomain}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Site',
          text: 'Scan this QR code to view our wedding website!',
          url: displayUrl,
        });
      } catch {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6 text-stone-700" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900">Share Your Site</h2>
          <p className="text-stone-500 text-sm mt-1">
            Guests can scan this QR code to view your wedding website
          </p>
        </div>

        {/* QR Code */}
        <div 
          ref={qrRef}
          className="bg-white p-6 rounded-xl border-2 border-stone-100 flex items-center justify-center mb-6"
        >
          <QRCodeSVG 
            value={displayUrl}
            size={200}
            level="H"
            includeMargin={false}
            bgColor="white"
            fgColor="#1c1917"
          />
        </div>

        {/* URL Display */}
        <div className="bg-stone-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-stone-500 mb-1">Website URL</p>
          <p className="text-sm text-stone-700 font-medium break-all">{displayUrl}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-stone-600" />
            )}
            <span className="text-xs text-stone-600">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <Download className="w-5 h-5 text-stone-600" />
            <span className="text-xs text-stone-600">Download</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <Share2 className="w-5 h-5 text-stone-600" />
            <span className="text-xs text-stone-600">Share</span>
          </button>
        </div>

        {/* Print tip */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-400 text-center">
            💡 Tip: Download the QR code to print on your wedding invitations
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
