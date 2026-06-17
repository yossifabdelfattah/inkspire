import { Router } from 'express';

// Stores are currently surfaced via the books module
// (GET /api/books/:id/stores). This router is reserved for future
// dedicated store endpoints and is intentionally empty for now so the
// public API surface is unchanged.
const router = Router();

export default router;
