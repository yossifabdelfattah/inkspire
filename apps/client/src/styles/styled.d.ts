import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
      border: string;
      text: string;
      textMuted: string;
      success: string;
      error: string;
      info: string;
      warning: string;
    };
    font: {
      family: string;
      size: Record<string, string> & {
        h1: string;
        h2: string;
        h3: string;
        h4: string;
        h5: string;
        h6: string;
      };
      weight: {
        regular: number;
        medium: number;
        bold: number;
      };
      lineHeight: {
        normal: number;
        heading: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
    };
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
      largeDesktop: number;
    };
  }
}
