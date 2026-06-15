import { TextInput, NumberInput, Textarea } from '@mantine/core';
import type { AdminBookPayload } from '../../services/adminService';

interface BookFormFieldsProps {
  form: AdminBookPayload;
  onChange: (key: keyof AdminBookPayload, value: string | number) => void;
}

function BookFormFields({ form, onChange }: BookFormFieldsProps) {
  return (
    <>
      <TextInput label="Title" value={form.title} onChange={(e) => onChange('title', e.currentTarget.value)} required mb="sm" />
      <TextInput label="Author" value={form.author} onChange={(e) => onChange('author', e.currentTarget.value)} required mb="sm" />
      <Textarea label="Description" value={form.description} onChange={(e) => onChange('description', e.currentTarget.value)} required mb="sm" minRows={2} />
      <TextInput label="Category" value={form.category} onChange={(e) => onChange('category', e.currentTarget.value)} required mb="sm" />
      <TextInput label="Image URL" value={form.image} onChange={(e) => onChange('image', e.currentTarget.value)} required mb="sm" />
      <NumberInput label="Price" value={form.price} onChange={(v) => onChange('price', Number(v) || 0)} min={0} decimalScale={2} required mb="sm" />
      <NumberInput label="Stock" value={form.stock} onChange={(v) => onChange('stock', Number(v) || 0)} min={0} required mb="md" />
    </>
  );
}

export default BookFormFields;
