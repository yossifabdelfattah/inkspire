import { useState } from 'react';
import { TextInput, Textarea, Button, Alert } from '@mantine/core';
import { Link } from 'react-router-dom';
import { createBookRequest } from '../services/bookRequestService';
import * as S from './RequestBook.styled';

type Status = 'idle' | 'loading' | 'success' | 'error';

function RequestBook() {
  const [form, setForm] = useState({ title: '', author: '', note: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const isValid = form.title.trim().length > 0 && form.author.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await createBookRequest({
        title: form.title.trim(),
        author: form.author.trim(),
        note: form.note.trim() || undefined,
      });
      setStatus('success');
      setForm({ title: '', author: '', note: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong while submitting your request. Please try again.');
    }
  };

  return (
    <S.Page>
      <S.Container>
        <S.FormCard as="form" onSubmit={handleSubmit} aria-labelledby="request-book-heading">
          <h1 id="request-book-heading">Request a Book</h1>
          <p>Can&apos;t find a book you&apos;re looking for? Let us know and we&apos;ll consider adding it to our catalog.</p>

          {status === 'success' && (
            <Alert title="Request submitted" color="green">
              Thanks! Your book request has been received.
            </Alert>
          )}

          {status === 'error' && (
            <Alert title="Submission failed" color="red">
              {errorMessage}
            </Alert>
          )}

          <label htmlFor="title">Title</label>
          <TextInput
            id="title"
            placeholder="Book title"
            value={form.title}
            onChange={(e) => handleChange('title', e.currentTarget.value)}
            required
            aria-required
          />

          <label htmlFor="author">Author</label>
          <TextInput
            id="author"
            placeholder="Author name"
            value={form.author}
            onChange={(e) => handleChange('author', e.currentTarget.value)}
            required
            aria-required
          />

          <label htmlFor="note">Note (optional)</label>
          <Textarea
            id="note"
            placeholder="Anything else we should know? (edition, ISBN, etc.)"
            value={form.note}
            onChange={(e) => handleChange('note', e.currentTarget.value)}
            minRows={3}
          />

          <S.SubmitRow>
            <Button type="submit" size="md" color="indigo" loading={status === 'loading'} disabled={!isValid || status === 'loading'}>
              Submit Request
            </Button>
            <Button component={Link} to="/books" variant="subtle" ml="sm">
              Back to Books
            </Button>
          </S.SubmitRow>
        </S.FormCard>
      </S.Container>
    </S.Page>
  );
}

export default RequestBook;
