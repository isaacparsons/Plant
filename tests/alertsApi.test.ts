import request from "supertest";
import app from "../server/index";
import mongoose from "mongoose";
import KEYS from "../config/keys";
import DatabaseManager from "../db/DatabaseManager";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import AlertController from "../controllers/alerts";
import AlertService from "../services/alerts";
import DeviceService from "../services/devices";
import models from "../db/models";
import { sendNotifications } from "../utils/notifications";
const { AlertCondition, AlertNotification, DispatchSetting, AssetFollower, Device } = models;

var userId = "53cb6b9b4f4ddef1ad47f942";
var alertId = "53cb6b9b4f4ddef1ad47f941";
var assetId = "ABC1";
const testAlert = {
  _id: alertId,
  userId: userId,
  alertConditionId: "53cb6b9b4f4ddef1ad47f943",
  date: new Date(),
  type: "threshold",
  assetId: "ABC1",
  alertMsg: "test alert",
  acknowledged: false,
};

// test cases:
// exisiting alertConditions -> should be replaced
// exisiting alertNotifications -> should be replaced
// exisiting dispatchSettings -> should be replaced
// no existing alertConditions -> should create
// no existing alertNotifications -> should create and create device if it doest exist
// no existing dispatchSettings -> should create

// tests:
// delete alert - success (valid alertId)
// delete alert - fail (invalid alertId)
// update alert - success (valid alertId)
// update alert - fail (invalid alertId)
// get alert - success (valid alertId)
// get alert - fail (valid alertId)

describe("Alerts Tests", () => {
  var databaseManager = new DatabaseManager();
  beforeAll(async () => {
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
  });
  it("test", async () => {});
  // it("send notifications", async () => {
  //   await deleteAllCollections(mongoose);
  //   expect.assertions(1);

  //   var assetFollowerId = mongoose.Types.ObjectId("53cb6b9b4f4ddef1ad47f943");
  //   // create email device and phone device
  //   var emailDevice = await DeviceService.createDevice({
  //     value: "isaac.2962@gmail.com",
  //     type: "email",
  //   });
  //   var phoneDevice = await DeviceService.createDevice({
  //     value: "14039908793",
  //     type: "phone",
  //   });
  //   // create alert notifications for each device
  //   await AlertService.createAlertNotification({
  //     assetFollowerId: assetFollowerId,
  //     deviceId: emailDevice._id,
  //   });
  //   await AlertService.createAlertNotification({
  //     assetFollowerId: assetFollowerId,
  //     deviceId: phoneDevice._id,
  //   });
  //   try {
  //     var sent = await sendNotifications(assetFollowerId, "Test alert");
  //     expect(sent).toBeTruthy();
  //   } catch (error) {}
  // });
  // it("POST /alert_options/:assetFollowerId - success", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   var newAlertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 15,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(newAlertOptions);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data).toMatchObject(newAlertOptions);

  //   var currentAlertConditions = await AlertCondition.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentAlertNotifications = await AlertNotification.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentDispatchSettings = await DispatchSetting.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   expect(currentAlertConditions.length).toEqual(1);
  //   expect(currentAlertConditions[0].value).toEqual(15);
  //   expect(currentAlertNotifications.length).toEqual(1);
  //   expect(currentDispatchSettings.length).toEqual(1);
  // });
  // it("POST /alert_options/:assetFollowerId - replace alert notification", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   var newAlertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 15,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           value: "test1@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(newAlertOptions);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data).toMatchObject(newAlertOptions);

  //   var currentAlertConditions = await AlertCondition.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentAlertNotifications = await AlertNotification.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentDispatchSettings = await DispatchSetting.find({
  //     assetFollowerId: assetFollowerId,
  //   });

  //   var currentDevice = await Device.findOne({
  //     _id: currentAlertNotifications[0].deviceId,
  //   });
  //   expect(currentAlertConditions.length).toEqual(1);
  //   expect(currentAlertNotifications.length).toEqual(1);
  //   expect(currentDevice.value).toEqual("test1@test.com");
  //   expect(currentDispatchSettings.length).toEqual(1);
  // });
  // it("POST /alert_options/:assetFollowerId - replace dispatch settings", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   var newAlertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 10,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(newAlertOptions);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data).toMatchObject(newAlertOptions);

  //   var currentAlertConditions = await AlertCondition.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentAlertNotifications = await AlertNotification.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   var currentDispatchSettings = await DispatchSetting.find({
  //     assetFollowerId: assetFollowerId,
  //   });
  //   expect(currentAlertConditions.length).toEqual(1);
  //   expect(currentAlertNotifications.length).toEqual(1);
  //   expect(currentDispatchSettings.length).toEqual(1);
  //   expect(currentDispatchSettings[0].rampRate).toEqual(10);
  // });
  // it("POST /alert_options/:assetFollowerId - replace exisiting alert condition", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(alertOptions);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data).toMatchObject(alertOptions);
  // });
  // it("POST /alert_options/:assetFollowerId - no assetFollowerId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollowerId = "123";
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(alertOptions);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("POST /alert_options/:assetFollowerId - no alertOptions", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollowerId = "53cb6b9b4f4ddef1ad47f943";
  //   var alertOptions = {};
  //   const res = await request(app).post(`/api/alert_options/${assetFollowerId}`).send(alertOptions);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("GET /api/alert_options/:assetFollowerId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).get(`/api/alert_options/${assetFollowerId}`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("GET /api/alert_options/:assetFollowerId - no assetFollowerId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetFollower = new AssetFollower({
  //     userId: userId,
  //     assetId: assetId,
  //   });
  //   await assetFollower.save();
  //   var assetFollowerId = assetFollower._id.toString();
  //   var alertOptions = {
  //     alertConditions: [
  //       {
  //         assetFollowerId: assetFollowerId,
  //         type: "threshold",
  //         value: 10,
  //         alertInterval: 5,
  //       },
  //     ],
  //     alertNotifications: [
  //       {
  //         _id: "53cb6b9b4f4ddef1ad47f944",
  //         assetFollowerId: assetFollowerId,
  //         sent: null,
  //         device: {
  //           _id: "53cb6b9b4f4ddef1ad47f942",
  //           value: "test@test.com",
  //           type: "email",
  //           lastSent: null,
  //         },
  //       },
  //     ],
  //     dispatchSettings: {
  //       assetId: "ABC1",
  //       assetFollowerId: assetFollowerId,
  //       rampRate: 1,
  //     },
  //   };
  //   await AlertController.saveAlertOptions(assetFollowerId, alertOptions);
  //   const res = await request(app).get(`/api/alert_options/${""}`);
  //   expect(res.statusCode).toEqual(404);
  // });
  // it("save alert", async () => {
  //   await deleteAllCollections(mongoose);
  //   await AlertController.saveAlert(testAlert);
  //   var alerts = await AlertController.getAlerts(userId);
  //   expect(alerts.length).toEqual(1);
  // });
  // it("GET /api/alerts/:userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).get(`/api/alerts/${userId}`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("GET /api/alerts/:userId - no userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).get(`/api/alerts/${""}`);
  //   expect(res.statusCode).toEqual(404);
  // });
  // it("UPDATE /api/alert/:userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var updatedAlert = {
  //     userId: userId,
  //     alertConditionId: "53cb6b9b4f4ddef1ad47f943",
  //     date: new Date(),
  //     type: "threshold",
  //     assetId: "ABC1",
  //     alertMsg: "test alert",
  //     acknowledged: true,
  //   };
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).put(`/api/alert/${alertId}`).send(updatedAlert);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data.acknowledged).toEqual(true);
  // });
  // it("UPDATE /api/alert/:userId - no existing alert", async () => {
  //   await deleteAllCollections(mongoose);
  //   var updatedAlert = {
  //     userId: userId,
  //     alertConditionId: "53cb6b9b4f4ddef1ad47f943",
  //     date: new Date(),
  //     type: "threshold",
  //     assetId: "ABC1",
  //     alertMsg: "test alert",
  //     acknowledged: true,
  //   };
  //   const res = await request(app).put(`/api/alert/${alertId}`).send(updatedAlert);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body.status).toEqual("error");
  // });
  // it("UPDATE /api/alert/:alertId - no alertId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var updatedAlert = {
  //     userId: userId,
  //     alertConditionId: "53cb6b9b4f4ddef1ad47f943",
  //     date: new Date(),
  //     type: "threshold",
  //     assetId: "ABC1",
  //     alertMsg: "test alert",
  //     acknowledged: true,
  //   };
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).put(`/api/alert/${""}`).send(updatedAlert);
  //   expect(res.statusCode).toEqual(404);
  // });
  // it("DELETE /api/alert/:alertId", async () => {
  //   await deleteAllCollections(mongoose);
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).delete(`/api/alert/${alertId}`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("DELETE /api/alert/:alertId - no alertId", async () => {
  //   await deleteAllCollections(mongoose);
  //   await AlertController.saveAlert(testAlert);
  //   const res = await request(app).delete(`/api/alert/${""}`);
  //   expect(res.statusCode).toEqual(404);
  // });
  // it("DELETE /api/alert/:alertId - alert doesnt exist", async () => {
  //   await deleteAllCollections(mongoose);
  //   const res = await request(app).delete(`/api/alert/${alertId}`);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body.status).toEqual("error");
  // });
  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
