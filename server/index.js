const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const cors = require("cors");
const enableWs = require("express-ws");
const schema = require("./Models.js");
const { nanoid } = require("nanoid");

const app = express();

const run = async () => {
  enableWs(app);
  try {
    await mongoose.connect(config.db.url + config.db.name, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    });
  } catch (error) {
    console.error(error);
    return;
  }
  console.log("Connected to mongodb.");
  app.use(cors());
  const connections = {};
  app.ws("/canvas", async (ws, req) => {
    const id = nanoid();
    connections[id] = ws;
    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg);
        switch (data.type) {
          case "CREATE_DOTS":
            const dotsArray = await schema.DotsArray.create({
              dots: data.dots,
            });
            Object.keys(connections).forEach((key) => {
              connections[key].send(
                JSON.stringify({
                  type: "CREATE_DOTS",
                  dots: dotsArray.dots,
                })
              );
            });
            break;
          case "INIT_CANVAS":
            const dotsArrays = await schema.DotsArray.find();
            ws.send(
              JSON.stringify({
                type: "INIT_CANVAS",
                dots: dotsArrays.map((array) => array.dots),
              })
            );
            break;
          default:
            ws.send(
              JSON.stringify({
                error: "Unknown message type:" + data.type,
              })
            );
            break;
        }
      } catch (error) {
        console.log(error);
        connection.ws.send(
          JSON.stringify({
            error: {
              original: error,
              message: "invalid JSON data",
            },
          })
        );
      }
    });

    ws.on("close", async (msg) => {
      delete connections[id];
    });
  });

  app.listen(config.port, () => {
    console.log(`Server started on ${config.port} port.`);
  });
};
run();
