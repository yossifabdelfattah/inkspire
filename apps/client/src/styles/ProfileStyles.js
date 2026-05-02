import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  max-width: 560px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

export const ProfileTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #111827;
`;

export const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProfileInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

export const ProfileButton = styled.button`
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

export const DeleteButton = styled.button`
  padding: 0.75rem;
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;

  &:hover {
    background: #fef2f2;
  }
`;

export const ProfileMessage = styled.p`
  font-size: 0.875rem;
  color: ${({ $error }) => ($error ? '#dc2626' : '#16a34a')};
`;