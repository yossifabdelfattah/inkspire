import { useEffect, useState } from 'react';
import { Table, Button, Badge, Alert, Loader, Group } from '@mantine/core';
import AdminLayout from './AdminLayout';
import { getBookRequests, updateBookRequestStatus, type BookRequestItem } from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import * as S from './AdminLayout.styled';

const statusColor: Record<BookRequestItem['status'], string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

function AdminRequests() {
  const { data: fetchedRequests, loading, error } = useFetch<BookRequestItem[]>(
    (signal) => getBookRequests(signal),
    [],
    [],
    'Could not fetch book requests.'
  );
  const [requests, setRequests] = useState<BookRequestItem[]>([]);
  const [updateError, setUpdateError] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setRequests(fetchedRequests);
  }, [fetchedRequests]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    setUpdateError(false);
    try {
      const updated = await updateBookRequestStatus(id, status);
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch {
      setUpdateError(true);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <S.SectionTitle>Book Requests</S.SectionTitle>

      {loading && <Loader size="sm" />}
      {error && <Alert color="red" title="Failed to load requests">{error}</Alert>}
      {updateError && <Alert color="red" title="Update failed" mb="sm">Failed to update request status.</Alert>}

      {!loading && !error && requests.length === 0 && <p>No book requests yet.</p>}

      {!loading && !error && requests.length > 0 && (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Author</Table.Th>
              <Table.Th>Requests</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((req) => (
              <Table.Tr key={req._id}>
                <Table.Td>{req.title}</Table.Td>
                <Table.Td>{req.author}</Table.Td>
                <Table.Td>{req.requestCount}</Table.Td>
                <Table.Td>{req.priorityScore}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor[req.status]} variant="light">
                    {req.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      size="xs"
                      color="green"
                      variant="light"
                      disabled={req.status === 'approved' || updatingId === req._id}
                      onClick={() => handleStatusChange(req._id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      disabled={req.status === 'rejected' || updatingId === req._id}
                      onClick={() => handleStatusChange(req._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </AdminLayout>
  );
}

export default AdminRequests;
