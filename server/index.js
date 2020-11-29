const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const cors = require("cors");
const enableWs = require("express-ws");
const schema = require("./Models.js");

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
  app.use(express.json());
  app.ws("/", async (ws, req) => {
    const connection = new schema.Connection({ ws });
    await connection.save();

    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg);
        switch (data.type) {
          case "CREATE_DOTS":
            const dots = await schema.Dot.create(...data);
            const connections = await schema.Connection.find();
            connections.forEach((connection) => {
              connection.ws.send({ type: "CREATE_DOTS", data: dots });
            });
            break;
          case "INIT_CANVAS":
            const dots = await schema.Dot.find();
            const connections = await schema.Connection.find();
            connections.forEach((connection) => {
              connection.ws.send({ type: "INIT_CANVAS", data: dots });
            });
            break;
          default:
            connection.ws.send(
              JSON.stringify({
                error: "Unknown message type:" + data.type,
              })
            );
            break;
        }
      } catch (error) {
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
      const response = await schema.Connection.findByIdAndDelete(
        connection._id
      );
    });
  });

  app.listen(config.port, () => {
    console.log(`Server started on ${config.port} port.`);
  });
};
run();
