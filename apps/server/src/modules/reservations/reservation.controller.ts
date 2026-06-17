import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as reservationService from './reservation.service';

// POST /api/reservations
export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.createReservation(req.body, req.user);
  res.status(201).json(reservation);
});

// GET /api/reservations/:id
export const getReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.getReservation(req.params.id as string, req.user);
  res.status(200).json(reservation);
});
