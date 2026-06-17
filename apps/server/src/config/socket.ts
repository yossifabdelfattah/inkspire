import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from './env';

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL },
  });

  io.on('connection', (socket) => {
    socket.on('joinBookRoom', (bookId: string) => socket.join(`book:${bookId}`));
    socket.on('leaveBookRoom', (bookId: string) => socket.leave(`book:${bookId}`));
  });

  return io;
};

export const getIO = (): Server | null => io;
