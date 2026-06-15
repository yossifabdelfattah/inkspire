import { Loader, Alert, Table } from '@mantine/core';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AdminLayout from './AdminLayout';
import {
  getSalesOverTime,
  getTopSearches,
  getMostRequestedBooks,
  getTopPurchasedBooks,
  type SalesPoint,
  type TopSearchTerm,
  type MostRequestedBook,
  type TopPurchasedBook,
} from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import * as S from './AdminLayout.styled';

interface AnalyticsData {
  sales: SalesPoint[];
  searches: TopSearchTerm[];
  requested: MostRequestedBook[];
  purchased: TopPurchasedBook[];
}

const emptyData: AnalyticsData = { sales: [], searches: [], requested: [], purchased: [] };

function AdminAnalytics() {
  const { data, loading, error } = useFetch<AnalyticsData>(
    async (signal) => {
      const [sales, searches, requested, purchased] = await Promise.all([
        getSalesOverTime(signal),
        getTopSearches(signal),
        getMostRequestedBooks(signal),
        getTopPurchasedBooks(signal),
      ]);
      return { sales, searches, requested, purchased };
    },
    [],
    emptyData,
    'Could not fetch analytics data.'
  );
  const { sales, searches, requested, purchased } = data;

  if (loading) {
    return (
      <AdminLayout>
        <S.SectionTitle>Analytics</S.SectionTitle>
        <Loader size="sm" />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.SectionTitle>Analytics</S.SectionTitle>
        <Alert color="red" title="Failed to load analytics">{error}</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.SectionTitle>Sales Over Time</S.SectionTitle>
      <S.ChartCard>
        {sales.length === 0 ? (
          <p>No orders yet — sales data will appear here once customers start checking out.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#5c4ad6" name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#2bb673" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </S.ChartCard>

      <S.SectionTitle>Top Searched Terms</S.SectionTitle>
      <S.ChartCard>
        {searches.length === 0 ? (
          <p>No searches logged yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={searches.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#5c4ad6" name="Searches" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </S.ChartCard>

      <S.SectionTitle>Most Requested Books</S.SectionTitle>
      <S.ChartCard>
        {requested.length === 0 ? (
          <p>No book requests yet.</p>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Author</Table.Th>
                <Table.Th>Requests</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {requested.map((r) => (
                <Table.Tr key={r._id}>
                  <Table.Td>{r.title}</Table.Td>
                  <Table.Td>{r.author}</Table.Td>
                  <Table.Td>{r.requestCount}</Table.Td>
                  <Table.Td>{r.priorityScore}</Table.Td>
                  <Table.Td>{r.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </S.ChartCard>

      <S.SectionTitle>Top Purchased Books</S.SectionTitle>
      <S.ChartCard>
        {purchased.length === 0 ? (
          <p>No purchases yet — top sellers will appear here once orders come in.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={purchased}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantitySold" fill="#2bb673" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </S.ChartCard>
    </AdminLayout>
  );
}

export default AdminAnalytics;
