import api from '../api/axios';

export interface MyProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export async function getMyProfile(): Promise<MyProfile> {
  const res = await api.get('/users/me');
  return res.data;
}

export async function updateMyProfile(data: { name: string }): Promise<MyProfile> {
  const res = await api.patch('/users/me', data);
  return res.data;
}
