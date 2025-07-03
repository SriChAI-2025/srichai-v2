import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'neo-brutalism' | 'classic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load theme from localStorage or default to neo-brutalism
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'neo-brutalism';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme class to document root
    document.documentElement.className = `theme-${newTheme}`;
  };

  const toggleTheme = () => {
    setTheme(theme === 'neo-brutalism' ? 'classic' : 'neo-brutalism');
  };

  useEffect(() => {
    // Apply theme class to document root on mount
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 