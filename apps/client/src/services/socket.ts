import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: true });
  }
  return socket;
}
