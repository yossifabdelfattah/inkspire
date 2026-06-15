const BookRequest = require('../models/BookRequest');

const normalize = (value) => value.trim().toLowerCase();

const calculatePriorityScore = (requestCount) => requestCount * 10;

// POST /api/book-requests
const createBookRequest = async (req, res, next) => {
  try {
    const { title, author, note } = req.body;

    if (!title || !title.trim() || !author || !author.trim()) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const normalizedTitle = normalize(title);
    const normalizedAuthor = normalize(author);

    const existing = await BookRequest.findOne({ normalizedTitle, normalizedAuthor });
    const uid = req.user?.uid ?? null;

    if (existing) {
      if (uid && existing.requesters.includes(uid)) {
        return res.status(200).json({ message: 'You have already requested this book', request: existing });
      }

      existing.requestCount += 1;
      existing.priorityScore = calculatePriorityScore(existing.requestCount);
      if (uid) existing.requesters.push(uid);
      await existing.save();
      return res.status(200).json({ message: 'Request already exists — vote count increased', request: existing });
    }

    const newRequest = await BookRequest.create({
      title: title.trim(),
      author: author.trim(),
      normalizedTitle,
      normalizedAuthor,
      note: note?.trim() || '',
      requestedBy: uid,
      requesters: uid ? [uid] : [],
      requestCount: 1,
      priorityScore: calculatePriorityScore(1),
    });

    res.status(201).json({ message: 'Book request created', request: newRequest });
  } catch (error) {
    next(error);
  }
};

// GET /api/book-requests
const getBookRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await BookRequest.find(filter).sort({ priorityScore: -1, createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/book-requests/:id (admin) — approve or reject a request
const updateBookRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, approved, or rejected' });
    }

    const request = await BookRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Book request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBookRequest, getBookRequests, updateBookRequestStatus };
