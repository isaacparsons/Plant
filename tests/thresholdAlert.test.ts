import mongoose from "mongoose";
import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import DatabaseManager from "../db/DatabaseManager";

import alertsBackgroundTasks from "../scheduled_tasks/alerts";
import AlertService from "../services/alerts";
import DispatchService from "../services/dispatchs";

const URL = MONGO.URL;

describe("Threshold Alert", () => {
  var databaseManager = new DatabaseManager();
  beforeAll(async () => {
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();

    // Create asset
    // Create user
    // Create asset follower
  });

  it("test ", async () => {});

  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
