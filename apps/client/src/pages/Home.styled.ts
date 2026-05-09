import { motion } from 'framer-motion';
import styled from 'styled-components';

export const HeroSection = styled.section`
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

export const HeroContent = styled(motion.div)`
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

export const Headline = styled(motion.h1)`
  font-size: ${({ theme }) => theme.font.size.h1};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.1;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

export const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.font.size.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-width: 32rem;
`;

export const CTAGroup = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    gap: ${({ theme }) => theme.spacing.xs};

    button,
    a {
      width: 100%;
    }
  }
`;

export const HeroVisual = styled(motion.div)`
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

export const HeroImage = styled.img`
  width: 100%;
  max-width: 420px;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(16, 24, 40, 0.1);
  object-fit: cover;
  background: #f3f4f6;
`;
