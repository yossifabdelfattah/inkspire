// Inkspire Breakpoints Utility
import { css } from 'styled-components';
import { breakpoints } from './theme';

export const media = {
  mobile: (...args) => css`
    @media (max-width: ${breakpoints.mobile}px) {
      ${css(...args)}
    }
  `,
  tablet: (...args) => css`
    @media (max-width: ${breakpoints.tablet}px) {
      ${css(...args)}
    }
  `,
  desktop: (...args) => css`
    @media (max-width: ${breakpoints.desktop}px) {
      ${css(...args)}
    }
  `,
  largeDesktop: (...args) => css`
    @media (max-width: ${breakpoints.largeDesktop}px) {
      ${css(...args)}
    }
  `,
};
