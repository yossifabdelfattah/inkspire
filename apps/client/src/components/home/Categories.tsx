import { Link } from 'react-router-dom';
import * as S from './Categories.styled';
import { Button } from '@mantine/core';
import type { FC } from 'react';

const CATEGORIES = [
  { id: 'fiction', title: 'Fiction', desc: 'Stories that spark imagination', img: 'https://source.unsplash.com/collection/190727/400x300' },
  { id: 'non-fiction', title: 'Non-fiction', desc: 'Learn from the best', img: 'https://source.unsplash.com/collection/1163637/400x300' },
  { id: 'sci-fi', title: 'Sci‑fi', desc: 'Futuristic adventures', img: 'https://source.unsplash.com/collection/190728/400x300' },
  { id: 'children', title: 'Children', desc: 'Books for young readers', img: 'https://source.unsplash.com/collection/190726/400x300' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const Categories: FC = () => {
  return (
    <S.Section>
      <S.SectionTitle>Browse by Category</S.SectionTitle>
      <S.Grid initial="hidden" animate="visible" transition={{ staggerChildren: 0.06 }}>
        {CATEGORIES.map((c) => (
          <S.Card key={c.id} variants={cardVariants} whileHover={{ scale: 1.02 }}>
            <S.CardLink as={Link} to={`/products?category=${encodeURIComponent(c.id)}`} aria-label={`Browse ${c.title}`}>
              <S.CardImage src={c.img} alt={c.title} />
              <S.CardBody>
                <S.CardTitle>{c.title}</S.CardTitle>
                <S.CardMeta>{c.desc}</S.CardMeta>
              </S.CardBody>
            </S.CardLink>
            <S.CardFooter>
              <Link to={`/products?category=${encodeURIComponent(c.id)}`}>
                <Button fullWidth variant="filled" size="xs" mt="sm">
                  Explore
                </Button>
              </Link>
            </S.CardFooter>
          </S.Card>
        ))}
      </S.Grid>
    </S.Section>
  );
};

export default Categories;
