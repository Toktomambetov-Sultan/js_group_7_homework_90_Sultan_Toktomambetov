const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DotsArrayModel = new Schema({
  dots: [
    {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = DotsArrayModel;
