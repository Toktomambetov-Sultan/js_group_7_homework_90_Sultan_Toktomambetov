const path = require("path");
const rootDir = __dirname;
module.exports = {
  port: 8000,
  rootDir,
  db: {
    name: "canvas",
    url: "mongodb://localhost:27017/",
  },
};
