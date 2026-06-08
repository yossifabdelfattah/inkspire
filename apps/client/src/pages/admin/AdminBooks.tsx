import { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, NumberInput, Textarea, Alert, Loader, ActionIcon, Group } from '@mantine/core';
import AdminLayout from './AdminLayout';
import { createBook, updateBook, deleteBook, type AdminBookPayload } from '../../services/adminService';
import type { BookApiItem } from '../../types/backend';
import api from '../../api/axios';
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
  const [books, setBooks] = useState<BookApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminBookPayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchBooks = () =>
    api.get('/books').then((res) => {
      setBooks(Array.isArray(res.data) ? res.data : []);
    });

  useEffect(() => {
    let mounted = true;

    fetchBooks()
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(false);
    try {
      await fetchBooks();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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
      await refresh();
    } catch {
      setFormError('Failed to save book. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this book? This cannot be undone.')) return;
    try {
      await deleteBook(id);
      await refresh();
    } catch {
      window.alert('Failed to delete the book.');
    }
  };

  return (
    <AdminLayout>
      <S.ToolbarRow>
        <S.SectionTitle>Manage Books</S.SectionTitle>
        <Button onClick={openCreate}>Add Book</Button>
      </S.ToolbarRow>

      {loading && <Loader size="sm" />}
      {error && <Alert color="red" title="Failed to load books">Could not fetch the book catalog.</Alert>}

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

          <TextInput label="Title" value={form.title} onChange={(e) => handleChange('title', e.currentTarget.value)} required mb="sm" />
          <TextInput label="Author" value={form.author} onChange={(e) => handleChange('author', e.currentTarget.value)} required mb="sm" />
          <Textarea label="Description" value={form.description} onChange={(e) => handleChange('description', e.currentTarget.value)} required mb="sm" minRows={2} />
          <TextInput label="Category" value={form.category} onChange={(e) => handleChange('category', e.currentTarget.value)} required mb="sm" />
          <TextInput label="Image URL" value={form.image} onChange={(e) => handleChange('image', e.currentTarget.value)} required mb="sm" />
          <NumberInput label="Price" value={form.price} onChange={(v) => handleChange('price', Number(v) || 0)} min={0} decimalScale={2} required mb="sm" />
          <NumberInput label="Stock" value={form.stock} onChange={(v) => handleChange('stock', Number(v) || 0)} min={0} required mb="md" />

          <Button type="submit" loading={saving} fullWidth>
            {editingId ? 'Save Changes' : 'Create Book'}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminBooks;
