import { Link } from 'react-router-dom';
import * as S from './Home.styled';
import heroImg from '../assets/hero.png';
import FeaturedBooks from '../components/books/FeaturedBooks';
import Categories from '../components/home/Categories';
import WhyChoose from '../components/home/WhyChoose';
import CTABanner from '../components/home/CTABanner';

function Home() {
  return (
    <>
      <S.HeroSection>
        <S.HeroContent
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          <S.Headline
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            Discover Your Next Favorite Book
          </S.Headline>
          <S.Description
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            Welcome to InkSpire — a modern bookstore experience. Browse curated collections, explore genres, and shop with ease.
          </S.Description>
          <S.CTAGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            <S.CTAButton as={Link} to="/products" aria-label="Browse books">
              Browse Books
            </S.CTAButton>
            <S.CTAButton as={Link} to="/products?category=all" className="outline" aria-label="Browse categories">
              Browse Categories
            </S.CTAButton>
          </S.CTAGroup>
        </S.HeroContent>
        <S.HeroVisual
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 60 }}
          aria-hidden="true"
        >
          <S.HeroImage
            src={heroImg}
            alt="Modern online bookstore hero"
            loading="eager"
          />
        </S.HeroVisual>
      </S.HeroSection>
      <FeaturedBooks />
      <Categories />
      <WhyChoose />
      <CTABanner />
    </>
  );
}

export default Home;
