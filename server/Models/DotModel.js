const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DotModel = new Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

module.exports = DotModel;
