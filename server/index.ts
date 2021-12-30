import express from "express";
import logger from "../config/logging";
import cron from "node-cron";
import morgan from "morgan";
import routes from "../routes";
import path from "path";
import bodyParser from "body-parser";
import { errorMiddleware } from "../errors/handleErrors";
import DatabaseManager from "../db/DatabaseManager";

// Using queue middleware
var queue = require("express-queue");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}
app.disable("etag");
app.use(bodyParser.json());
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.use("/api", routes);
app.use(errorMiddleware);

export class Server {
  database: any;
  datamanager: any;

  constructor() {
    this.database = new DatabaseManager();
  }
  async start() {
    try {
      await this.database.connect();
      await this.datamanager.start();
    } catch (error) {
      console.log(error);
    }
  }
}

export var server = new Server();

if (process.env.NODE_ENV === "production") {
  server.start();
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("/", async (req: any, res: any) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
} else {
  server.start();
}

export default app;
