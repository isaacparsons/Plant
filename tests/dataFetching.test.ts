import mongoose from "mongoose";
import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import { alertConditions as alertConditionsType } from "../config/types";

import DatabaseManager from "../db/DatabaseManager";
import alertsBackgroundTasks from "../scheduled_tasks/alerts";
import AlertService from "../services/alerts";
import AssetService from "../services/assets";
import UserService from "../services/user";
import DispatchService from "../services/dispatchs";
import InactiveAlerts from "../scheduled_tasks/inactiveAlert";

import TestData from "./data/data";
import { DataManager } from "../scheduled_tasks/DataManager";
import MODELS from "../db/models";
const { Alert } = MODELS;
const URL = MONGO.URL;

// cases:
// invalid dispatch -> should create alert

describe("Data Fetching", () => {
  var databaseManager = new DatabaseManager();
  var dataManager = new DataManager();
  var asset: any = null;
  var user: any = null;
  var assetFollower: any = null;

  beforeAll(async () => {
    // Connect to a Mongo DB
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
    asset = await AssetService.createAsset(TestData.asset); // Create asset
    user = await UserService.createUser(TestData.user.accountName, TestData.user.password); // Create user
    assetFollower = await AssetService.createAssetFollower(user._id, asset.assetId); // Create asset follower
  });

  it("Invalid dispatch alert -> should create alert ", async () => {
    var alertCondition = await AlertService.createAlertCondition({
      assetFollowerId: assetFollower._id,
      ...TestData.invalidDispatchAlertCondition,
    });

    await dataManager.updateDispatchData([TestData.invalidDispatch]);
    // await InactiveAlerts.checkAlertConditions();

    var alerts = await AlertService.findAlerts(user._id);
    expect(alerts.length).toEqual(1);
    expect(alerts[0].type).toEqual(alertConditionsType.invalidDispatch);
  });

  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
