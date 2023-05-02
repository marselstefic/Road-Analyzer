const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
 title: {
   type: String,
   required: true,
 },
});



module.exports = mongoose.model("dataModel", DataSchema);