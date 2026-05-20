import axios from 'axios';
import { firebaseAuth } from '../firebase/firebase';


const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;
  if(user){
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
