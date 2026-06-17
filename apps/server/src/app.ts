import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './config/env';

import bookRoutes from './modules/books/book.routes';
import reviewRoutes from './modules/reviews/review.routes';
import orderRoutes from './modules/orders/order.routes';
import reservationRoutes from './modules/reservations/reservation.routes';
import checkoutRoutes from './modules/checkout/checkout.routes';
import bookRequestRoutes from './modules/bookRequests/bookRequest.routes';
import adminRoutes from './modules/admin/admin.routes';
import authRoutes from './modules/auth/auth.routes';

import { notFound } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

const app: Express = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API is running' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books/:bookId/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/book-requests', bookRequestRoutes);
app.use('/api/users', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
