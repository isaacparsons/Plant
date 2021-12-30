import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import DatabaseManager from "../db/DatabaseManager";
import AssetService from "../services/assets";
import UserService from "../services/user";
import AlertService from "../services/alerts";
import DispatchService from "../services/dispatchs";
import DeviceService from "../services/devices";

import TestData from "./data/data";
import { sendNotifications } from "../utils/notifications";

const validEmail = {
  value: "isaac.2962@gmail.com",
  type: "email",
};
const validPhone = {
  value: "1403998793",
  type: "phone",
};

// cases:
// 1. send valid email
// 2. send invalid email
// 3. send text
// 4. send email
// 5. send valid and invalid email
// 6. send valid and invalid text

describe("Utils", () => {
  var databaseManager = new DatabaseManager();
  var asset: any = null;
  var user: any = null;
  var assetFollower: any = null;
  beforeAll(async () => {
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
    asset = await AssetService.createAsset(TestData.asset); // Create asset
    user = await UserService.createUser(TestData.user.accountName, TestData.user.password); // Create user
    assetFollower = await AssetService.createAssetFollower(user._id, asset.assetId); // Create asset follower
  });

  it("send valid email ", async () => {
    await databaseManager.deleteDeviceCollection();
    await databaseManager.deleteAlertNotificationCollection();
    // create email device
    var device: any = await DeviceService.createDevice(validEmail);
    // create alert notification
    var alertNotification: any = await AlertService.createAlertNotification({
      assetFollowerId: assetFollower._id,
      deviceId: device._id,
    });

    var { emails, phones }: any = await sendNotifications(assetFollower._id, "test notification");

    expect(emails.length).toEqual(1);
    expect(emails[0]._id).toEqual(device._id);
    expect(phones.length).toEqual(0);
  });

  it("send valid phone ", async () => {
    await databaseManager.deleteDeviceCollection();
    await databaseManager.deleteAlertNotificationCollection();
    // create phone device
    var device: any = await DeviceService.createDevice(validPhone);
    // create alert notification
    var alertNotification: any = await AlertService.createAlertNotification({
      assetFollowerId: assetFollower._id,
      deviceId: device._id,
    });

    var { emails, phones }: any = await sendNotifications(assetFollower._id, "test notification");

    expect(emails.length).toEqual(0);
    expect(phones.length).toEqual(1);
    expect(phones[0]._id).toEqual(device._id);
  });

  // it("send invalid email ", async () => {
  //   // create email device
  //   // create alert notification
  // });

  // it("send invalid email", async () => {
  //   // create email device
  //   // create alert notification
  // });

  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
