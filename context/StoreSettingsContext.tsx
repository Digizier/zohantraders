'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings, subscribeToDb } from '@/lib/db';
import { INITIAL_SETTINGS } from '@/lib/seed-data';

interface StoreSettingsContextType {
  settings: StoreSettings;
  refreshSettings: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: INITIAL_SETTINGS,
  refreshSettings: () => {},
});

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const refreshSettings = () => {
    setSettings(getStoreSettings());
  };

  useEffect(() => {
    refreshSettings();
    const unsubscribe = subscribeToDb('settings', () => {
      refreshSettings();
    });
    return unsubscribe;
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
}
