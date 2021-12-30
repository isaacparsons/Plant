import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import TestData from "./data/data";
import { alertConditions as alertConditionsType } from "../config/types";

import InactiveAlerts from "../scheduled_tasks/inactiveAlert";
import AlertService from "../services/alerts";
import AssetService from "../services/assets";
import UserService from "../services/user";
import DispatchService from "../services/dispatchs";
import EnergyService from "../services/energy";
import DatabaseManager from "../db/DatabaseManager";

// cases:
// new dispatch that is the same (or within the threshold) of the past dispatch -> dont create alert
// new dispatch that is different and exceeds threshold and not created -> create alert
// new dispatch that is different and exceeds threshold and is expired -> create alert
// new dispatch that is different and exceeds threshold and is not expired -> dont create alert

describe("Inactive Alert", () => {
  var asset: any = null;
  var user: any = null;
  var assetFollower: any = null;
  var databaseManager = new DatabaseManager();
  var alertCondition: any = null;

  beforeAll(async () => {
    // Connect to a Mongo DB
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
    asset = await AssetService.createAsset(TestData.asset); // Create asset
    user = await UserService.createUser(TestData.user.accountName, TestData.user.password); // Create user
    assetFollower = await AssetService.createAssetFollower(user._id, asset.assetId); // Create asset follower
    alertCondition = await AlertService.createAlertCondition({
      assetFollowerId: assetFollower._id,
      ...TestData.inactiveDispatchAlertCondition,
    });
  });

  it("threshold not exceeded", async () => {
    await databaseManager.deleteDispatchCollection();
    // create energy point
    await EnergyService.createEnergy({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:40:00.000Z",
      value: 350,
    });
    // create previous dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:44:00.000Z",
      value: 350,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:43:00.000Z",
    });
    // create current dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:45:00.000Z",
      value: 350,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:44:00.000Z",
    });
    await InactiveAlerts.checkAlertConditions();

    var alerts = await AlertService.findAlerts(user._id);
    expect(alerts.length).toEqual(0);
  });
  it("threshold exceeded - no previous alert", async () => {
    await databaseManager.deleteDispatchCollection();
    // create energy point
    await EnergyService.createEnergy({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:40:00.000Z",
      value: 350,
    });
    // create previous dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:44:00.000Z",
      value: 350,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:43:00.000Z",
    });
    // create current dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:45:00.000Z",
      value: 340,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:44:00.000Z",
    });
    await InactiveAlerts.checkAlertConditions();

    var alerts = await AlertService.findAlerts(user._id);
    expect(alerts.length).toEqual(1);
    expect(alerts[0].type).toEqual(alertConditionsType.inactive);
  });
  it("threshold exceeded - expired alert", async () => {
    await databaseManager.deleteDispatchCollection();
    await databaseManager.deleteAlertCollection();
    // create expired alert
    var alert = await AlertService.createAlert({
      alertConditionId: alertCondition._id,
      userId: user._id,
      assetId: asset.assetId,
      type: alertConditionsType.inactive,
      date: "2021-10-29T21:40:00.000Z",
      alertMsg: "test alert",
    });
    // create energy point
    await EnergyService.createEnergy({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:40:00.000Z",
      value: 350,
    });
    // create previous dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:44:00.000Z",
      value: 350,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:43:00.000Z",
    });
    // create current dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:45:00.000Z",
      value: 340,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:44:00.000Z",
    });
    await InactiveAlerts.checkAlertConditions();

    var alerts = await AlertService.findAlerts(user._id);
    expect(alerts.length).toEqual(2);
  });
  it("threshold exceeded - not expired alert", async () => {
    await databaseManager.deleteDispatchCollection();
    await databaseManager.deleteAlertCollection();
    var date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    // create expired alert
    var alert = await AlertService.createAlert({
      alertConditionId: alertCondition._id,
      userId: user._id,
      assetId: asset.assetId,
      type: alertConditionsType.inactive,
      date: date,
      alertMsg: "test alert",
    });
    // create energy point
    await EnergyService.createEnergy({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:40:00.000Z",
      value: 350,
    });
    // create previous dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:44:00.000Z",
      value: 350,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:43:00.000Z",
    });
    // create current dispatch
    await DispatchService.createDispatch({
      units: "MW",
      assetId: "KH1",
      date: "2021-10-29T21:45:00.000Z",
      value: 340,
      status: "Acknowledged",
      instructionDate: "2021-10-29T21:44:00.000Z",
    });
    await InactiveAlerts.checkAlertConditions();

    var alerts = await AlertService.findAlerts(user._id);
    expect(alerts.length).toEqual(1);
  });

  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
