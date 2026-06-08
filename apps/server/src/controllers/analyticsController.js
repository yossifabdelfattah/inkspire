const SearchLog = require('../models/SearchLog');

// GET /api/admin/analytics/searches
// Returns top searched terms grouped by normalizedQuery
const getTopSearches = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const results = await SearchLog.aggregate([
      {
        $group: {
          _id: '$normalizedQuery',
          count: { $sum: 1 },
          totalResults: { $sum: '$resultCount' },
          avgResults: { $avg: '$resultCount' },
          lastSearchedAt: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          term: '$_id',
          count: 1,
          totalResults: 1,
          avgResults: { $round: ['$avgResults', 1] },
          lastSearchedAt: 1,
        },
      },
    ]);

    res.status(200).json({ searches: results, total: results.length });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch search analytics',
      error: error.message,
    });
  }
};

module.exports = { getTopSearches };
