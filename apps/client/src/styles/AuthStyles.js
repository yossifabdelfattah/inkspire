import styled from 'styled-components';

export const AuthWrapper = styled.div`
  max-width: 420px;
  margin: 4rem auto;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

export const AuthTitle = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #111827;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AuthInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #111827;
  }
`;

export const AuthButton = styled.button`
  padding: 0.75rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }
`;

export const AuthError = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
`;

export const AuthSuccess = styled.p`
  color: #16a34a;
  font-size: 0.875rem;
`;

export const AuthLink = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;

  a {
    color: #111827;
    font-weight: 600;
  }
`;