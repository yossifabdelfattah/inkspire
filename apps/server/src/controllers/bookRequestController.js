const BookRequest = require('../models/BookRequest');

const normalize = (value) => value.trim().toLowerCase();

const calculatePriorityScore = (requestCount) => requestCount * 10;

// POST /api/book-requests
const createBookRequest = async (req, res) => {
  try {
    const { title, author, note } = req.body;

    if (!title || !title.trim() || !author || !author.trim()) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const normalizedTitle = normalize(title);
    const normalizedAuthor = normalize(author);

    const existing = await BookRequest.findOne({ normalizedTitle, normalizedAuthor });

    if (existing) {
      existing.requestCount += 1;
      existing.priorityScore = calculatePriorityScore(existing.requestCount);
      await existing.save();
      return res.status(200).json({ message: 'Request already exists — vote count increased', request: existing });
    }

    const newRequest = await BookRequest.create({
      title: title.trim(),
      author: author.trim(),
      normalizedTitle,
      normalizedAuthor,
      note: note?.trim() || '',
      requestedBy: req.user?.uid ?? null,
      requestCount: 1,
      priorityScore: calculatePriorityScore(1),
    });

    res.status(201).json({ message: 'Book request created', request: newRequest });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create book request',
      error: error.message,
    });
  }
};

// GET /api/book-requests
const getBookRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const requests = await BookRequest.find(filter).sort({ priorityScore: -1, createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch book requests',
      error: error.message,
    });
  }
};

// PATCH /api/book-requests/:id (admin) — approve or reject a request
const updateBookRequestStatus = async (req, res) => {
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
    res.status(500).json({
      message: 'Failed to update book request',
      error: error.message,
    });
  }
};

module.exports = { createBookRequest, getBookRequests, updateBookRequestStatus };
