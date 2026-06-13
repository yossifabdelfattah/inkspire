import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const MapWrapper = styled.div`
  height: 280px;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

export const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StoreCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    flex-direction: column;
  }
`;

export const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.font.size.xs};
  }
`;

export const StoreName = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}px) {
    align-items: flex-start;
  }
`;

export const StockBadge = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  font-size: ${({ theme }) => theme.font.size.xs};
  white-space: nowrap;
`;

export const DirectionsLink = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const EmptyState = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;
