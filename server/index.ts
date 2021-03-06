import express from "express";
import logger from "../config/logging";
import cron from "node-cron";
import morgan from "morgan";
import routes from "../routes";
import path from "path";
import bodyParser from "body-parser";
import { errorMiddleware } from "../errors/handleErrors";
import DatabaseManager from "../db/DatabaseManager";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}
app.disable("etag");
app.use(bodyParser.json());

app.use("/api", routes);
app.use(errorMiddleware);

class Server {
  database: any;
  datamanager: any;

  constructor() {
    this.database = new DatabaseManager();
  }
  async start() {
    try {
      await this.database.connect();
    } catch (error) {
      console.log(error);
    }
  }
}

export var server = new Server();

// import PlantController from "../controllers/plants";
// var date = new Date();
// PlantController.createPlantData("61d0f7a018a80ee6c4d8f8d1", date, 20, 14, 16, true);

// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/", async (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// }

export default app;
