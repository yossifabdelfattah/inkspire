import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.font.family};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    line-height: ${({ theme }) => theme.font.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: ${({ theme }) => theme.font.size.sm};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: color 0.2s;
    &:hover, &:focus {
      color: ${({ theme }) => theme.colors.secondary};
      outline: none;
    }
  }

  button, [role="button"], input[type="submit"], input[type="button"] {
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    font: inherit;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transition: background 0.2s, box-shadow 0.2s;
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.secondary};
      outline-offset: 2px;
    }
  }

  input, textarea, select {
    font: inherit;
    border-radius: ${({ theme }) => theme.radius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.xs};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.secondary};
      outline-offset: 2px;
    }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.family};
    font-weight: ${({ theme }) => theme.font.weight.bold};
    line-height: ${({ theme }) => theme.font.lineHeight.heading};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  h1 { font-size: ${({ theme }) => theme.font.size.h1}; }
  h2 { font-size: ${({ theme }) => theme.font.size.h2}; }
  h3 { font-size: ${({ theme }) => theme.font.size.h3}; }
  h4 { font-size: ${({ theme }) => theme.font.size.h4}; }
  h5 { font-size: ${({ theme }) => theme.font.size.h5}; }
  h6 { font-size: ${({ theme }) => theme.font.size.h6}; }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.font.size.sm};
  }

  ul, ol {
    margin-left: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  img, svg {
    max-width: 100%;
    display: block;
  }

  /* Accessibility: focus ring for all focusable elements */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  /* Responsive font size */
  @media (max-width: 480px) {
    html {
      font-size: 15px;
    }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }
`;
