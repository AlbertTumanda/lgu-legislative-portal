import { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  logo_url: string;
  icon_url: string;
  site_title: string;
}

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    logo_url: '/sblogo.jpg',
    icon_url: '/sblogo.jpg',
    site_title: 'Sangguniang Bayan - Batuan, Bohol',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings.site_title) {
      document.title = settings.site_title;
    }
    if (settings.icon_url) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = settings.icon_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = settings.icon_url;
        document.head.appendChild(newLink);
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
