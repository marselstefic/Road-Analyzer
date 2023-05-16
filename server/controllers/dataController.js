const Data = require('../models/data');

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
