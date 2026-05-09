import type { ComponentPropsWithoutRef } from 'react';
import * as S from './Button.styled';

type ButtonProps = ComponentPropsWithoutRef<'button'>;

export default function Button(props: ButtonProps) {
  return <S.Button {...props} />;
}