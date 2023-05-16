const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

// Route to get all data
router.get('/data', dataController.getAllData);

module.exports = router;
