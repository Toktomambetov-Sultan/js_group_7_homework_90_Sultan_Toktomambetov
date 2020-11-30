const mongoose = require("mongoose");

const DotsArrayModel = require("./Models/DotModel");

const DotsArray = mongoose.model("DotsArray", DotsArrayModel);

module.exports = {
  DotsArray,
};
