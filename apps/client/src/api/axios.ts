import axios from 'axios';
import { firebaseAuth } from '../firebase/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  const currentUser = firebaseAuth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
