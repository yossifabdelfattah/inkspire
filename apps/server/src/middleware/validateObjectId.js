const mongoose = require('mongoose');

// Returns 400 if req.params[paramName] isn't a valid Mongo ObjectId,
// instead of letting a CastError fall through to the generic error handler as a 500.
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ message: `Invalid ${paramName}` });
  }
  next();
};

module.exports = { validateObjectId };
