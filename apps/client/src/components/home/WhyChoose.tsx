import * as S from './WhyChoose.styled';
import type { FC } from 'react';

const features = [
  { icon: '📚', title: 'Curated Collections', desc: 'Hand-picked books from expert curators.' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Reliable shipping with tracking and fast fulfillment.' },
  { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options with secure checkout.' },
  { icon: '⭐', title: 'Top Ratings', desc: 'Trusted reviews and recommendations from readers.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const WhyChoose: FC = () => {
  return (
    <S.Section>
      <S.SectionTitle>Why Choose Inkspire</S.SectionTitle>
      <S.Grid initial="hidden" animate="visible" transition={{ staggerChildren: 0.06 }}>
        {features.map((f) => (
          <S.FeatureCard key={f.title} variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <S.Icon aria-hidden>{f.icon}</S.Icon>
            <S.FeatureTitle>{f.title}</S.FeatureTitle>
            <S.FeatureDesc>{f.desc}</S.FeatureDesc>
          </S.FeatureCard>
        ))}
      </S.Grid>
    </S.Section>
  );
};

export default WhyChoose;
