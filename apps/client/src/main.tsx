import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <MantineProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <ErrorBoundary>
                <GlobalStyles />
                <App />
              </ErrorBoundary>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MantineProvider>
  </StrictMode>
);
