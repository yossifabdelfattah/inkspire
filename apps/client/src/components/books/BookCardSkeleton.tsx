import { Skeleton } from '@mantine/core';
import * as S from './BookCardSkeleton.styled';

function BookCardSkeleton() {
  return (
    <S.Card>
      <Skeleton height={200} width={140} radius="sm" />
      <Skeleton height={18} mt={8} width="90%" radius="sm" />
      <Skeleton height={14} mt={4} width="60%" radius="sm" />
      <Skeleton height={14} mt={4} width="40%" radius="sm" />
      <Skeleton height={18} mt={8} width="50%" radius="sm" />
      <Skeleton height={32} mt={12} width="100%" radius="md" />
    </S.Card>
  );
}

export default BookCardSkeleton;
