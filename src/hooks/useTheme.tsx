import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  // null means use system theme (default)
  const [savedTheme, setSavedTheme] = useState<Theme | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || null;
  });

  // Effective theme is either saved theme or system theme
  const effectiveTheme = savedTheme || getSystemTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Listen to system theme changes when using system theme (savedTheme is null)
  useEffect(() => {
    if (savedTheme !== null) return; // Only listen if using system theme

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = getSystemTheme();

      if (systemTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [savedTheme]);

  const setTheme = (newTheme: Theme) => {
    setSavedTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme: effectiveTheme, setTheme };
}