import { useEffect } from 'react';
import { applyTheme, useThemeStore } from '~/stores/theme';

export function useTheme() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}
