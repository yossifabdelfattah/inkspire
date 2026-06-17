import http from 'http';
import { env } from './config/env';
import app from './app';
import connectDB from './config/db';
import { initSocket } from './config/socket';
import { startReservationCleanupJob } from './modules/reservations/reservationCleanup.service';

connectDB();
startReservationCleanupJob();

const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
