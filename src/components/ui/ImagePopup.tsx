import React, { useEffect } from 'react';
import { FaXmark, FaDownload } from 'react-icons/fa6';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImagePopup({ isOpen, onClose, imageUrl }: ImagePopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-2xl p-2 shadow-2xl max-w-4xl w-full border border-white/10">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-zinc-800 text-white p-2 rounded-full hover:bg-zinc-700 transition-colors z-[10000]"
        >
          <FaXmark size={20} />
        </button>
        <img src={imageUrl} alt="Full view" className="w-full h-auto rounded-xl" referrerPolicy="no-referrer" />
        <div className="p-4 flex justify-end">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <FaDownload /> تحميل
          </button>
        </div>
      </div>
    </div>
  );
}
