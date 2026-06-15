import { Loader, Alert } from '@mantine/core';
import AdminLayout from './AdminLayout';
import { getOverview, type OverviewStats } from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import * as S from './AdminLayout.styled';

function AdminOverview() {
  const { data: stats, loading, error } = useFetch<OverviewStats | null>(
    (signal) => getOverview(signal),
    [],
    null,
    'Could not fetch admin overview data.'
  );

  return (
    <AdminLayout>
      <S.SectionTitle>Overview</S.SectionTitle>

      {loading && <Loader size="sm" />}
      {error && <Alert color="red" title="Failed to load overview">{error}</Alert>}

      {stats && (
        <S.CardGrid>
          <S.Card>
            <S.CardLabel>Books</S.CardLabel>
            <S.CardValue>{stats.bookCount}</S.CardValue>
          </S.Card>
          <S.Card>
            <S.CardLabel>Pending Requests</S.CardLabel>
            <S.CardValue>{stats.pendingRequestCount}</S.CardValue>
          </S.Card>
          <S.Card>
            <S.CardLabel>Orders</S.CardLabel>
            <S.CardValue>{stats.orderCount}</S.CardValue>
          </S.Card>
          <S.Card>
            <S.CardLabel>Users</S.CardLabel>
            <S.CardValue>{stats.userCount}</S.CardValue>
          </S.Card>
          <S.Card>
            <S.CardLabel>Total Revenue</S.CardLabel>
            <S.CardValue>${stats.totalRevenue.toFixed(2)}</S.CardValue>
          </S.Card>
        </S.CardGrid>
      )}
    </AdminLayout>
  );
}

export default AdminOverview;
