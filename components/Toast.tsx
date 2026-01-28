import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2 seconds duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 md:right-8 z-50 animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-brand-surface border border-brand-purple/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] text-white px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
        <div className="p-2 bg-brand-pink/20 rounded-lg">
           <Flame className="w-5 h-5 text-brand-pink fill-current animate-pulse" />
        </div>
        <span className="font-display font-black tracking-wider text-sm">{message}</span>
      </div>
    </div>
  );
};