const getCart = async (req, res) => {
  res.status(200).json({
    message: 'Cart route ready. Store cart in frontend state first, then persist later.'
  });
};

module.exports = { getCart };
