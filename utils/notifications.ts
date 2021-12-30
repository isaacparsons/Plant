import logger from "../config/logging";
import AlertService from "../services/alerts";
import DeviceService from "../services/devices";
import { sendEmails } from "./email";
import { sendMultipleSms } from "./sms";

const getAlertNotificationsDevicesFromAlert = async (assetFollowerId: any) => {
  var alertNotifications = await AlertService.findAlertNotifications(assetFollowerId);
  console.log(alertNotifications);

  var devices = await Promise.all(
    alertNotifications.map(async (alertNotification: { deviceId: any }) => {
      return await DeviceService.findDevice({
        _id: alertNotification.deviceId,
      });
    })
  );
  return devices;
};

const updateDevicesLastSent = async (devices: any) => {
  var date = new Date();
  await Promise.all(
    devices.map(async (device: any) => {
      device.lastSent = date;
      await DeviceService.updateDevice(device);
    })
  );
};

export const sendNotifications = async (assetFollowerId: any, alertMsg: any) => {
  var devices = await getAlertNotificationsDevicesFromAlert(assetFollowerId);
  var emailDevices = devices.filter((item: any) => item.type == "email");
  var phoneDevices = devices.filter((item: any) => item.type == "phone");

  // update device lastSent
  var sentDevices = [...emailDevices, ...phoneDevices];
  await updateDevicesLastSent(sentDevices);

  if (process.env.NODE_ENV === "production") {
    await sendEmails(emailDevices, "URICA ALERT", alertMsg);
    await sendMultipleSms(phoneDevices, alertMsg);
  }
  // logger.info("emails");
  //   logger.info(emailDevices);
  //   logger.info("phones");
  //   logger.info(phoneDevices);
  return {
    emails: emailDevices,
    phones: phoneDevices,
  };
};
