import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <ThemeProvider theme={ theme }>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <GlobalStyles />
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </MantineProvider>
  </StrictMode>
);
