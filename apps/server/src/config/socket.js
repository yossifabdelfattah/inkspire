const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
  });

  io.on('connection', (socket) => {
    socket.on('joinBookRoom', (bookId) => socket.join(`book:${bookId}`));
    socket.on('leaveBookRoom', (bookId) => socket.leave(`book:${bookId}`));
  });

  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
