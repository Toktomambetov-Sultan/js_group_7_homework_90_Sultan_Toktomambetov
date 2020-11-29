const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConnectionModel = new Schema({
  ws: Object,
});

module.exports = ConnectionModel;
