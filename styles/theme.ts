// Design tokens and theme configuration
export const theme = {
  colors: {
    dark: {
      DEFAULT: '#0f0f1e',
      50: '#1a1a2e',
      100: '#16162a',
      200: '#121226',
      300: '#0f0f1e',
      400: '#0a0a16',
      500: '#06060e',
    },
    accent: {
      DEFAULT: '#00d4ff',
      light: '#4de3ff',
      dark: '#00a8cc',
    },
    purple: {
      DEFAULT: '#7c3aed',
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    headerHeight: '64px',
    headerHeightMobile: '56px',
    containerMaxWidth: '1280px',
    sectionPadding: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(0, 212, 255, 0.4)',
    glowPurple: '0 0 20px rgba(124, 58, 237, 0.4)',
  },
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '350ms ease',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
