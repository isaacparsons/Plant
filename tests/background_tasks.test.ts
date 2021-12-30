import mongoose from "mongoose";
import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import DatabaseManager from "../db/DatabaseManager";

import alertsBackgroundTasks from "../scheduled_tasks/alerts";
import AlertService from "../services/alerts";
import DispatchService from "../services/dispatchs";

const URL = MONGO.URL;

// get asset list

// get new dispatches from api and add any new ones
// get new energy data from api and add any new data points

// delete energy points and dispatches from > x days ago

// check threshold conditions

// check predispatch conditions

// check inactive dispatch conditions

describe("BackgroundTasks Tests", () => {
  var databaseManager = new DatabaseManager();
  beforeAll(async () => {
    // Connect to a Mongo DB
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
  });
  // Inactive dispatch alert:
  // cases:
  //  - dispatch has been inactive for less than inactive time threshold -> should not create alert
  //  - dispatch has been inactive for more than inactive time threshold -> should create alert
  it("test ", async () => {});
  // it("get latest dispatch", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);

  //   var assetId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f941");
  //   var date1 = new Date();
  //   var date2 = new Date();
  //   var date3 = new Date();
  //   date3.setDate(date3.getDate() + 1);
  //   date2.setDate(date2.getDate() - 1);
  //   date1.setDate(date1.getDate() - 2);

  //   var dispatch1 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date1,
  //     value: 40,
  //   });
  //   var dispatch2 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date2,
  //     value: 100,
  //   });
  //   var dispatch3 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date3,
  //     value: 100,
  //   });

  //   expect(latestDispatch.date).toEqual(dispatch2.date);
  //   expect(latestDispatch.value).toEqual(dispatch2.value);
  // });
  // it("get latest dispatch with ramp rate increasing", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);

  //   var assetId = "SH1";
  //   var currentDate = new Date(2021, 1, 1, 1, 45);
  //   var currentDispatchDate = new Date(2021, 1, 1, 1, 40);
  //   var lastDispatchDate = new Date(2021, 1, 1, 1, 30);
  //   var dispatchDelta = 5;
  //   var rampRate = 1;
  //   // dispatchDelta/rampRate*0.4 < 5

  //   var currentDispatch = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: currentDispatchDate,
  //     value: dispatchDelta,
  //   });
  //   var lastDispatch = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: lastDispatchDate,
  //     value: 0,
  //   });

  //   var dispatch = await DispatchService.findDispatchValue(assetId, currentDate, rampRate);

  //   // dispatchDelta / ( dispatchDelta/rampRate + 10 + 5 ) =  0.25MW/min, for 5 minutes = 1.25MW

  //   expect(dispatch.value).toEqual(1.25);
  // });
  // it("get latest dispatch with ramp rate decreasing", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);

  //   var assetId = "SH1";
  //   var currentDate = new Date(2021, 1, 1, 1, 45);
  //   var currentDispatchDate = new Date(2021, 1, 1, 1, 40);
  //   var lastDispatchDate = new Date(2021, 1, 1, 1, 30);
  //   var dispatchDelta = 5;
  //   var rampRate = 1;

  //   var currentDispatch = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: currentDispatchDate,
  //     value: 0,
  //   });
  //   var lastDispatch = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: lastDispatchDate,
  //     value: dispatchDelta,
  //   });

  //   var dispatch = await DispatchService.findDispatchValue(assetId, currentDate, rampRate);

  //   // dispatchDelta / ( dispatchDelta/rampRate + 10 + 5 ) =  0.25MW/min, for 5 minutes = 1.25MW
  //   // 5 - 1.25 = 3.75

  //   expect(dispatch.value).toEqual(3.75);
  // });
  // it("get next dispatch", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);

  //   var assetId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f941");
  //   var date1 = new Date();
  //   var date2 = new Date();
  //   var date3 = new Date();
  //   var date4 = new Date();
  //   date4.setDate(date4.getDate() + 2);
  //   date3.setDate(date3.getDate() + 1);
  //   date2.setDate(date2.getDate() - 1);
  //   date1.setDate(date1.getDate() - 2);

  //   var dispatch1 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date1,
  //     value: 40,
  //   });
  //   var dispatch2 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date2,
  //     value: 100,
  //   });
  //   var dispatch3 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date3,
  //     value: 100,
  //   });
  //   var dispatch4 = await DispatchService.createDispatch({
  //     assetId: assetId,
  //     date: date4,
  //     value: 100,
  //   });

  //   var nextDispatch = await DispatchService.findNextDispatch(assetId, new Date());

  //   expect(nextDispatch.date).toEqual(dispatch3.date);
  //   expect(nextDispatch.value).toEqual(dispatch3.value);
  // });
  // it("check alertIsExpired - not expired", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);
  //   var userId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f941");
  //   var assetFollowerId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f942");
  //   var assetId = "ABC1";
  //   var alertInterval = 10;
  //   var alertCreatedDate = new Date(2021, 5, 22, 11, 55);
  //   var testDate = new Date(2021, 5, 22, 12);

  //   var alertCondition = await AlertService.createAlertCondition({
  //     assetFollowerId: assetFollowerId,
  //     type: "threshold",
  //     value: 10,
  //     alertInterval: alertInterval,
  //   });

  //   var alert = await AlertService.createAlert({
  //     alertConditionId: alertCondition._id,
  //     userId: userId,
  //     date: alertCreatedDate,
  //     type: "threshold",
  //     assetId: assetId,
  //     alertMsg: "Test alert",
  //   });

  //   var alertIsExpired = await AlertService.isLatestAlertExpired(alertCondition, testDate);
  //   expect(alertIsExpired).toEqual(false);
  // });
  // it("check alertIsExpired - expired", async () => {
  //   await mongoose.connect(URL, { useNewUrlParser: true });
  //   await deleteAllCollections(mongoose);
  //   var userId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f941");
  //   var assetFollowerId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f942");
  //   var assetId = "ABC1";
  //   var alertInterval = 10;
  //   var alertCreatedDate = new Date(2021, 5, 22, 11, 45);
  //   var testDate = new Date(2021, 5, 22, 12);

  //   var alertCondition = await AlertService.createAlertCondition({
  //     assetFollowerId: assetFollowerId,
  //     type: "threshold",
  //     value: 10,
  //     alertInterval: alertInterval,
  //   });

  //   var alert = await AlertService.createAlert({
  //     alertConditionId: alertCondition._id,
  //     userId: userId,
  //     date: alertCreatedDate,
  //     type: "threshold",
  //     assetId: assetId,
  //     alertMsg: "Test alert",
  //   });

  //   var alertIsExpired = await AlertService.isLatestAlertExpired(alertCondition, testDate);
  //   expect(alertIsExpired).toEqual(true);
  // });
  // it("check isThresholdConditionMet - not met", async () => {
  //   var dispatch = {
  //     date: new Date(),
  //     value: 100,
  //   };
  //   var energyPoint = {
  //     date: new Date(),
  //     value: 100,
  //   };
  //   var isThresholdConditionMet = alertsBackgroundTasks.isThresholdAlert(energyPoint, dispatch, 10);
  //   expect(isThresholdConditionMet).toEqual(false);
  // });
  // it("check isThresholdConditionMet - met", async () => {
  //   var dispatch = {
  //     date: new Date(),
  //     value: 100,
  //   };
  //   var energyPoint = {
  //     date: new Date(),
  //     value: 120,
  //   };
  //   var isThresholdConditionMet = alertsBackgroundTasks.isThresholdAlert(energyPoint, dispatch, 10);
  //   expect(isThresholdConditionMet).toEqual(true);
  // });
  // it("check isPreDispatchConditionMet - not met", async () => {
  //   var currentDate = new Date();
  //   var dispatchDate = new Date();
  //   currentDate.setMinutes(dispatchDate.getMinutes() - 11);
  //   var dispatch = {
  //     date: dispatchDate,
  //     value: 100,
  //   };
  //   var isPreDispatchConditionMet = alertsBackgroundTasks.isPreDispatchAlert(currentDate, dispatch, 10);
  //   expect(isPreDispatchConditionMet).toEqual(false);
  // });
  // it("check isPreDispatchConditionMet - met", async () => {
  //   var currentDate = new Date();
  //   var dispatchDate = new Date();
  //   currentDate.setMinutes(currentDate.getMinutes() - 9);
  //   var dispatch = {
  //     date: dispatchDate,
  //     value: 100,
  //   };
  //   var isPreDispatchConditionMet = alertsBackgroundTasks.isPreDispatchAlert(currentDate, dispatch, 10);
  //   expect(isPreDispatchConditionMet).toEqual(true);
  // });
  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
