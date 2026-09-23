'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export function FloatingWhatsApp() {
  const { settings } = useStoreSettings();
  const cleanNumber = (settings.whatsapp || '923338586852').replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Hello Zohan Traders, I would like to inquire about your products and services.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-emerald-400"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="font-semibold text-sm hidden md:inline-block pr-1">Chat on WhatsApp</span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
      </span>
    </a>
  );
}
