import { useState } from 'react';
import { Table, Button, Modal, Alert, Loader, ActionIcon, Group } from '@mantine/core';
import AdminLayout from './AdminLayout';
import BookFormFields from './BookFormFields';
import { createBook, updateBook, deleteBook, getAllBooks, type AdminBookPayload } from '../../services/adminService';
import type { BookApiItem } from '../../types/backend';
import { useFetch } from '../../hooks/useFetch';
import * as S from './AdminLayout.styled';

const emptyForm: AdminBookPayload = {
  title: '',
  author: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  stock: 0,
};

function AdminBooks() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: books, loading, error } = useFetch<BookApiItem[]>(
    (signal) => getAllBooks(signal),
    [reloadKey],
    [],
    'Could not fetch the book catalog.'
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminBookPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const refresh = () => setReloadKey((key) => key + 1);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (book: BookApiItem) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category ?? '',
      image: book.image ?? '',
      stock: book.stock ?? 0,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (key: keyof AdminBookPayload, value: string | number) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      if (editingId) {
        await updateBook(editingId, form);
      } else {
        await createBook(form);
      }
      setModalOpen(false);
      refresh();
    } catch {
      setFormError('Failed to save book. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this book? This cannot be undone.')) return;
    setDeleteError('');
    try {
      await deleteBook(id);
      refresh();
    } catch {
      setDeleteError('Failed to delete the book.');
    }
  };

  return (
    <AdminLayout>
      <S.ToolbarRow>
        <S.SectionTitle>Manage Books</S.SectionTitle>
        <Button onClick={openCreate}>Add Book</Button>
      </S.ToolbarRow>

      {loading && <Loader size="sm" />}
      {error && <Alert color="red" title="Failed to load books">{error}</Alert>}
      {deleteError && <Alert color="red" title="Delete failed" mb="sm">{deleteError}</Alert>}

      {!loading && !error && (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Author</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {books.map((book) => (
              <Table.Tr key={book._id}>
                <Table.Td>{book.title}</Table.Td>
                <Table.Td>{book.author}</Table.Td>
                <Table.Td>{book.category ?? '—'}</Table.Td>
                <Table.Td>${book.price.toFixed(2)}</Table.Td>
                <Table.Td>{book.stock ?? 0}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" aria-label={`Edit ${book.title}`} onClick={() => openEdit(book)}>
                      ✎
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label={`Delete ${book.title}`} onClick={() => handleDelete(book._id)}>
                      ✕
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Book' : 'Add Book'} centered>
        <form onSubmit={handleSubmit}>
          {formError && (
            <Alert color="red" mb="sm" title="Error">
              {formError}
            </Alert>
          )}

          <BookFormFields form={form} onChange={handleChange} />

          <Button type="submit" loading={saving} fullWidth>
            {editingId ? 'Save Changes' : 'Create Book'}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminBooks;
