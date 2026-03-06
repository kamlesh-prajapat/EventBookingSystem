// Theme configuration with light and dark color schemes

export const themes = {
  light: {
    // Primary colors
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#E3F2FD',
    
    // Secondary colors
    secondary: '#FF9800',
    secondaryDark: '#F57C00',
    secondaryLight: '#FFE0B2',
    
    // Status colors
    success: '#4CAF50',
    successDark: '#388E3C',
    successLight: '#E8F5E9',
    
    warning: '#FFC107',
    warningDark: '#FFA000',
    warningLight: '#FFF8E1',
    
    error: '#F44336',
    errorDark: '#D32F2F',
    errorLight: '#FFEBEE',
    
    info: '#2196F3',
    infoLight: '#E3F2FD',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceHover: '#F5F5F5',
    
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    
    border: '#BDBDBD',
    borderLight: '#E0E0E0',
    divider: '#E0E0E0',
    
    // Shadows
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    shadowMd: '0 2px 6px rgba(0, 0, 0, 0.16)',
    shadowLg: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  
  dark: {
    // Primary colors
    primary: '#64B5F6',
    primaryDark: '#42A5F5',
    primaryLight: '#1E3A8A',
    
    // Secondary colors
    secondary: '#FFB74D',
    secondaryDark: '#FFA726',
    secondaryLight: '#FF8A65',
    
    // Status colors
    success: '#66BB6A',
    successDark: '#43A047',
    successLight: '#1B5E20',
    
    warning: '#FDD835',
    warningDark: '#F9A825',
    warningLight: '#F57F17',
    
    error: '#EF5350',
    errorDark: '#E53935',
    errorLight: '#B71C1C',
    
    info: '#64B5F6',
    infoLight: '#0D47A1',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    
    background: '#121212',
    surface: '#1E1E1E',
    surfaceHover: '#2D2D2D',
    
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textDisabled: '#757575',
    
    border: '#333333',
    borderLight: '#404040',
    divider: '#383838',
    
    // Shadows
    shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 2px 6px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 4px 12px rgba(0, 0, 0, 0.5)',
  }
}

export const getTheme = (themeName) => themes[themeName] || themes.light

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
}

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
}

export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
}

export const transitions = {
  fast: 'all 0.15s ease-in-out',
  base: 'all 0.25s ease-in-out',
  slow: 'all 0.35s ease-in-out',
}

export const breakpoints = {
  xs: '0px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
}

// Media query helpers
export const media = {
  xs: '@media (min-width: 0px)',
  sm: '@media (min-width: 480px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  xxl: '@media (min-width: 1536px)',
}
