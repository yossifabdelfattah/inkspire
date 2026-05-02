import api from '../api/axios';

export const loginRequest = (email, password) =>
  api.post('/auth/login', { email, password });

export const registerRequest = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const forgotPasswordRequest = (email) =>
  api.post('/auth/forgot-password', { email });

export const resetPasswordRequest = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });

export const refreshTokenRequest = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken });