import { useEffect, useState } from 'react';
import { Table, Button, Badge, Alert, Loader, Group, Modal, Stack, Card, Text, Image } from '@mantine/core';
import AdminLayout from './AdminLayout';
import BookFormFields from './BookFormFields';
import {
  getBookRequests,
  updateBookRequestStatus,
  getBookRequestCandidates,
  createBook,
  type BookRequestItem,
  type BookCandidate,
  type AdminBookPayload,
} from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import * as S from './AdminLayout.styled';

const statusColor: Record<BookRequestItem['status'], string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

const emptyBookForm: AdminBookPayload = {
  title: '',
  author: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  stock: 0,
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

  const [approveTarget, setApproveTarget] = useState<BookRequestItem | null>(null);
  const [step, setStep] = useState<'pick' | 'form'>('pick');
  const [candidates, setCandidates] = useState<BookCandidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesError, setCandidatesError] = useState('');
  const [bookForm, setBookForm] = useState<AdminBookPayload>(emptyBookForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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

  const openApprove = async (req: BookRequestItem) => {
    setApproveTarget(req);
    setStep('pick');
    setCandidates([]);
    setCandidatesError('');
    setSaveError('');
    setCandidatesLoading(true);
    try {
      const result = await getBookRequestCandidates(req._id);
      setCandidates(result.candidates);
      if (result.message) setCandidatesError(result.message);
    } catch {
      setCandidatesError('Could not fetch suggestions from Google Books. You can still enter the details manually.');
    } finally {
      setCandidatesLoading(false);
    }
  };

  const closeApprove = () => {
    setApproveTarget(null);
    setBookForm(emptyBookForm);
  };

  const pickCandidate = (candidate: BookCandidate | null) => {
    if (!approveTarget) return;
    setBookForm({
      title: candidate?.title || approveTarget.title,
      author: candidate?.author || approveTarget.author,
      description: candidate?.description ?? '',
      category: candidate?.category ?? '',
      image: candidate?.image ?? '',
      price: 0,
      stock: 0,
    });
    setStep('form');
  };

  const handleBookFormChange = (key: keyof AdminBookPayload, value: string | number) => {
    setBookForm((s) => ({ ...s, [key]: value }));
  };

  const handleFinalizeApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveTarget) return;

    setSaving(true);
    setSaveError('');
    try {
      await createBook(bookForm);
      const updated = await updateBookRequestStatus(approveTarget._id, 'approved');
      setRequests((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      closeApprove();
    } catch {
      setSaveError('Failed to add the book. Please check the fields and try again.');
    } finally {
      setSaving(false);
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
                      onClick={() => openApprove(req)}
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

      <Modal
        opened={!!approveTarget}
        onClose={closeApprove}
        title={step === 'pick' ? 'Approve Book Request — Pick a Match' : 'Approve Book Request — Review Details'}
        centered
        size="lg"
      >
        {step === 'pick' && approveTarget && (
          <Stack>
            <Text size="sm" c="dimmed">
              Suggestions for "{approveTarget.title}" by {approveTarget.author}. Pick a match to prefill the new book, or enter the details manually.
            </Text>

            {candidatesLoading && <Loader size="sm" />}
            {candidatesError && <Alert color="yellow" title="No suggestions">{candidatesError}</Alert>}

            {!candidatesLoading &&
              candidates.map((candidate, index) => (
                <Card key={index} withBorder padding="sm" onClick={() => pickCandidate(candidate)} style={{ cursor: 'pointer' }}>
                  <Group align="flex-start" wrap="nowrap">
                    {candidate.image ? (
                      <Image src={candidate.image} alt={candidate.title} w={60} h={90} fit="contain" />
                    ) : (
                      <div style={{ width: 60, height: 90, flexShrink: 0 }} />
                    )}
                    <div>
                      <Text fw={600}>{candidate.title}</Text>
                      <Text size="sm" c="dimmed">{candidate.author}</Text>
                      {candidate.category && <Badge variant="light" mt={4}>{candidate.category}</Badge>}
                      <Text size="xs" mt={4} lineClamp={2}>{candidate.description}</Text>
                    </div>
                  </Group>
                </Card>
              ))}

            <Button variant="subtle" onClick={() => pickCandidate(null)}>
              None of these — enter details manually
            </Button>
          </Stack>
        )}

        {step === 'form' && approveTarget && (
          <form onSubmit={handleFinalizeApproval}>
            {saveError && (
              <Alert color="red" mb="sm" title="Error">
                {saveError}
              </Alert>
            )}

            <BookFormFields form={bookForm} onChange={handleBookFormChange} />

            <Group justify="space-between">
              <Button variant="subtle" onClick={() => setStep('pick')} disabled={saving}>
                Back to suggestions
              </Button>
              <Button type="submit" loading={saving}>
                Add Book &amp; Approve Request
              </Button>
            </Group>
          </form>
        )}
      </Modal>
    </AdminLayout>
  );
}

export default AdminRequests;
