import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Returns 400 if req.params[paramName] isn't a valid Mongo ObjectId,
// instead of letting a CastError fall through to the generic error handler as a 500.
export const validateObjectId =
  (paramName = 'id') =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
  };
