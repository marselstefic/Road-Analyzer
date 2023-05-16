const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  gyroX: Number,
  gyroY: Number,
  gyroZ: Number,
  accelerometerX: Number,
  accelerometerY: Number,
  accelerometerZ: Number,
  longitude: Number,
  latitude: Number,
  timestamp: Date,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
