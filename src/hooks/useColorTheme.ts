import { useState, useEffect, useCallback } from 'react';

export type ColorTheme = 'default' | 'high-contrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';

const STORAGE_KEY = 'app_color_theme';

export const useColorTheme = () => {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'default';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as ColorTheme) || 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Erro ao salvar tema no localStorage:', e);
    }
  }, [theme]);

  const changeTheme = useCallback((newTheme: ColorTheme) => {
    setTheme(newTheme);
  }, []);

  return { theme, changeTheme };
};