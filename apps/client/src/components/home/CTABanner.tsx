import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import * as S from './CTABanner.styled';
import type { FC } from 'react';

const CTABanner: FC = () => {
  return (
    <S.Banner initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <S.BannerContent>
        <S.BannerTitle>Find Your Next Favorite Book</S.BannerTitle>
        <S.BannerDesc>Explore thousands of titles across genres. Fast shipping — secure checkout.</S.BannerDesc>
      </S.BannerContent>

      <div>
        <Link to="/products" aria-label="Browse books">
          <Button size="md" radius="md" color="dark">Browse Books</Button>
        </Link>
      </div>
    </S.Banner>
  );
};

export default CTABanner;
