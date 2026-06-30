import React, { createContext, useContext, useState, useEffect } from 'react';

// Built-in theme presets
export const themes = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      bg: '#0d0f1a',
      bgSecondary: '#1e293b',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      accentPrimary: '#6366f1',
      accentSecondary: '#f755ef',
      accentTertiary: '#ec4899',
    }
  },
  light: {
    id: 'light',
    name: 'Light Mode',
    colors: {
      bg: '#f8fafc',
      bgSecondary: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      accentPrimary: '#4f46e5',
      accentSecondary: '#7c3aed',
      accentTertiary: '#db2777',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Theme',
    colors: {
      bg: '#0b1a24',
      bgSecondary: '#0f2d3a',
      textPrimary: '#e0f2fe',
      textSecondary: '#7dd3fc',
      accentPrimary: '#0ea5e9',
      accentSecondary: '#06b6d4',
      accentTertiary: '#14b8a6',
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest Theme',
    colors: {
      bg: '#0a1612',
      bgSecondary: '#112c24',
      textPrimary: '#f0fdf4',
      textSecondary: '#86efac',
      accentPrimary: '#10b981',
      accentSecondary: '#84cc16',
      accentTertiary: '#06b6d4',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Theme',
    colors: {
      bg: '#1a0f1a',
      bgSecondary: '#2a1215',
      textPrimary: '#fff1f2',
      textSecondary: '#fda4af',
      accentPrimary: '#f43f5e',
      accentSecondary: '#f97316',
      accentTertiary: '#e11d48',
    }
  },
  custom: {
    id: 'custom',
    name: 'Custom Theme',
    colors: {
      bg: '#121212',
      bgSecondary: '#1e1e1e',
      textPrimary: '#ffffff',
      textSecondary: '#aaaaaa',
      accentPrimary: '#3b82f6',
      accentSecondary: '#8b5cf6',
      accentTertiary: '#ec4899',
    }
  }
};

const ThemeContext = createContext();

// Helper to convert hex to RGB string (e.g. "#6366f1" -> "99, 102, 241")
export const hexToRgb = (hex) => {
  if (!hex) return '0, 0, 0';
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Helper to calculate relative luminance of a color
export const getLuminance = (hex) => {
  if (!hex) return 0;
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Helper to adjust color brightness (positive for lighter, negative for darker)
export const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
};

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('theme-id') || 'dark';
  });

  const [customThemeColors, setCustomThemeColors] = useState(() => {
    const saved = localStorage.getItem('custom-theme-colors');
    return saved ? JSON.parse(saved) : { ...themes.custom.colors };
  });

  // Function to apply variables to an element or documentElement
  const applyThemeVariables = (themeId, customColors, targetElement = document.documentElement) => {
    let colors = {};
    if (themeId === 'custom') {
      const isBgDark = getLuminance(customColors.bg) < 0.5;
      colors = {
        ...customColors,
        // Dynamically compute secondary colors based on contrast
        bgSecondary: isBgDark ? adjustBrightness(customColors.bg, 8) : adjustBrightness(customColors.bg, -8),
        textSecondary: isBgDark ? adjustBrightness(customColors.textPrimary, -25) : adjustBrightness(customColors.textPrimary, 25),
        glassBg: isBgDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.04)',
        glassBorder: isBgDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
      };
    } else {
      const activeTheme = themes[themeId] || themes.dark;
      const isBgDark = getLuminance(activeTheme.colors.bg) < 0.5;
      colors = {
        ...activeTheme.colors,
        glassBg: isBgDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.04)',
        glassBorder: isBgDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
      };
    }

    // Set properties
    targetElement.style.setProperty('--bg-color', colors.bg);
    targetElement.style.setProperty('--bg-color-secondary', colors.bgSecondary);
    targetElement.style.setProperty('--text-primary', colors.textPrimary);
    targetElement.style.setProperty('--text-secondary', colors.textSecondary);
    targetElement.style.setProperty('--accent-primary', colors.accentPrimary);
    targetElement.style.setProperty('--accent-secondary', colors.accentSecondary);
    targetElement.style.setProperty('--accent-tertiary', colors.accentTertiary);
    targetElement.style.setProperty('--glass-bg', colors.glassBg);
    targetElement.style.setProperty('--glass-border', colors.glassBorder);

    // Glow rgb helpers
    const primaryRgb = hexToRgb(colors.accentPrimary);
    const secondaryRgb = hexToRgb(colors.accentSecondary);
    targetElement.style.setProperty('--accent-primary-glow', `rgba(${primaryRgb}, 0.15)`);
    targetElement.style.setProperty('--accent-secondary-glow', `rgba(${secondaryRgb}, 0.15)`);
    targetElement.style.setProperty('--accent-primary-rgb', primaryRgb);
    targetElement.style.setProperty('--accent-secondary-rgb', secondaryRgb);
  };

  useEffect(() => {
    applyThemeVariables(currentThemeId, customThemeColors);
    localStorage.setItem('theme-id', currentThemeId);
  }, [currentThemeId, customThemeColors]);

  const selectTheme = (themeId) => {
    setCurrentThemeId(themeId);
  };

  const updateCustomTheme = (newColors) => {
    setCustomThemeColors(newColors);
    localStorage.setItem('custom-theme-colors', JSON.stringify(newColors));
    setCurrentThemeId('custom');
  };

  // Helper function to return theme variables for previewing on a container without affecting the app
  const getThemeVariablesObject = (themeId, customColors) => {
    let colors = {};
    if (themeId === 'custom') {
      const isBgDark = getLuminance(customColors.bg) < 0.5;
      colors = {
        ...customColors,
        bgSecondary: isBgDark ? adjustBrightness(customColors.bg, 8) : adjustBrightness(customColors.bg, -8),
        textSecondary: isBgDark ? adjustBrightness(customColors.textPrimary, -25) : adjustBrightness(customColors.textPrimary, 25),
        glassBg: isBgDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.04)',
        glassBorder: isBgDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
      };
    } else {
      const activeTheme = themes[themeId] || themes.dark;
      const isBgDark = getLuminance(activeTheme.colors.bg) < 0.5;
      colors = {
        ...activeTheme.colors,
        glassBg: isBgDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.04)',
        glassBorder: isBgDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
      };
    }

    const primaryRgb = hexToRgb(colors.accentPrimary);
    const secondaryRgb = hexToRgb(colors.accentSecondary);

    return {
      '--bg-color': colors.bg,
      '--bg-color-secondary': colors.bgSecondary,
      '--text-primary': colors.textPrimary,
      '--text-secondary': colors.textSecondary,
      '--accent-primary': colors.accentPrimary,
      '--accent-secondary': colors.accentSecondary,
      '--accent-tertiary': colors.accentTertiary,
      '--glass-bg': colors.glassBg,
      '--glass-border': colors.glassBorder,
      '--accent-primary-glow': `rgba(${primaryRgb}, 0.15)`,
      '--accent-secondary-glow': `rgba(${secondaryRgb}, 0.15)`,
      '--accent-primary-rgb': primaryRgb,
      '--accent-secondary-rgb': secondaryRgb,
    };
  };

  return (
    <ThemeContext.Provider value={{
      currentThemeId,
      customThemeColors,
      selectTheme,
      updateCustomTheme,
      getThemeVariablesObject
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
