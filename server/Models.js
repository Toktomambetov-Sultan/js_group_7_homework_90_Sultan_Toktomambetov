const mongoose = require("mongoose");

const DotModel = require("./Models/DotModel");
const ConnectionModel = require("./Models/ConnectionModel");

const Dot = mongoose.model("Dot", DotModel);
const Connection = mongoose.model("Connection", ConnectionModel);

module.exports = {
  Dot,
  Connection,
};
