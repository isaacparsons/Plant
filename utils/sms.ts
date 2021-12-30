import Nexmo from "nexmo";
import KEYS from "../config/keys";
const { MESSAGER } = KEYS.default;
const { sms_number, api_key, api_secret } = MESSAGER;
const nexmo = new Nexmo({
  apiKey: api_key,
  apiSecret: api_secret,
});

export const sendMultipleSms = async (devices: string | any[], message: any) => {
  for (let i = 0; i < devices.length; i++) {
    var phone = devices[i];
    try {
      await sendSms(sms_number, phone.value, message);
    } catch (error) {
      console.log(`Unable to send text to ${phone}`);
    }
  }
};

export const sendSms = (from: string, number: string, message: string) => {
  return new Promise((resolve, reject) =>
    nexmo.message.sendSms(from, number, message, {}, (err: any, responseData: any) => {
      if (err) {
        console.log(err);
        reject(`failed to send message to ${number}`);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          resolve(`sent message to ${number}`);
        } else {
          console.log(`Message failed with error: ${responseData.messages[0]["error-text"]}`);
          reject(`failed to send message to ${number}`);
        }
      }
    })
  );
};
