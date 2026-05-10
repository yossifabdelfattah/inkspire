// Inkspire Breakpoints Utility
import { css } from 'styled-components';

import { breakpoints } from './theme';

type CSSArgs = Parameters<typeof css>;

export const media = {
  mobile: (...args: CSSArgs) => css`
    @media (max-width: ${breakpoints.mobile}px) {
      ${css(...args)}
    }
  `,
  tablet: (...args: CSSArgs) => css`
    @media (max-width: ${breakpoints.tablet}px) {
      ${css(...args)}
    }
  `,
  desktop: (...args: CSSArgs) => css`
    @media (max-width: ${breakpoints.desktop}px) {
      ${css(...args)}
    }
  `,
  largeDesktop: (...args: CSSArgs) => css`
    @media (max-width: ${breakpoints.largeDesktop}px) {
      ${css(...args)}
    }
  `,
};