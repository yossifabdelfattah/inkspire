import api from '../api/axios';

export const getUserRequest = () =>
  api.get('/users/user');

export const updateUserRequest = (data) =>
  api.put('/users/user', data);

export const deleteUserRequest = () =>
  api.delete('/users/user');