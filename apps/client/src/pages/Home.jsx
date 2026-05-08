import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button as MantineButton } from '@mantine/core';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero.png';

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70vh;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  gap: ${({ theme }) => theme.spacing.lg};
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.md};
    min-height: 60vh;
  }
`;

const HeroContent = styled(motion.div)`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  @media (max-width: 900px) {
    align-items: center;
  }
`;

const Headline = styled(motion.h1)`
  font-size: ${({ theme }) => theme.font.size.h1};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.1;
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.font.size.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-width: 32rem;
`;

const CTAGroup = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    gap: ${({ theme }) => theme.spacing.xs};
    button, a {
      width: 100%;
    }
  }
`;

function Home() {
  return (
    <HeroSection>
      <HeroContent
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      >
        <Headline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          Discover Your Next Favorite Book
        </Headline>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          Welcome to InkSpire — a modern bookstore experience. Browse curated collections, explore genres, and shop with ease.
        </Description>
        <CTAGroup
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          <Link to="/products">
            <MantineButton
              size="md"
              radius="md"
              color="indigo"
              style={{
                fontWeight: 600,
                fontSize: '1.1rem',
                padding: '0.85rem 2.2rem',
                minHeight: '44px',
              }}
            >
              Browse Books
            </MantineButton>
          </Link>
          <Link to="/products?category=all">
            <MantineButton
              size="md"
              variant="outline"
              radius="md"
              color="indigo"
              style={{
                fontWeight: 500,
                fontSize: '1.1rem',
                padding: '0.85rem 2.2rem',
                minHeight: '44px',
              }}
            >
              Browse Categories
            </MantineButton>
          </Link>
        </CTAGroup>
      </HeroContent>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 60 }}
        style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}
        aria-hidden="true"
      >
        <img
          src={heroImg}
          alt="Modern online bookstore hero"
          style={{
            width: '100%',
            maxWidth: 420,
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 24px rgba(16,24,40,0.10)',
            objectFit: 'cover',
            background: '#f3f4f6',
          }}
          loading="eager"
        />
      </motion.div>
    </HeroSection>
  );
}

export default Home;
