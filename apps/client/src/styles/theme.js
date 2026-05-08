// Inkspire Theme Design System

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};

export const theme = {
  colors: {
    background: '#f9fafb',
    surface: '#fff',
    primary: '#2d3748',
    secondary: '#4f46e5',
    accent: '#f59e42',
    muted: '#f3f4f6',
    border: '#e5e7eb',
    text: '#111827',
    textMuted: '#6b7280',
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#fbbf24',
  },
  font: {
    family: 'Inter, Arial, sans-serif',
    size: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
      lg: '1.5rem',
      xl: '2.25rem',
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      h4: '1.25rem',
      h5: '1rem',
      h6: '0.875rem',
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      normal: 1.5,
      heading: 1.2,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
  },
  radius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(16, 24, 40, 0.05)',
    md: '0 2px 8px rgba(16, 24, 40, 0.08)',
    lg: '0 4px 24px rgba(16, 24, 40, 0.12)',
  },
  breakpoints,
};

export default theme;
