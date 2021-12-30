var nodemailer = require("nodemailer");
import KEYS from "../config/keys";
const { EMAILER } = KEYS.default;

export const sendEmails = async (devices: any[], subject: any, message: any) => {
  for (let i = 0; i < devices.length; i++) {
    var email = devices[i];
    try {
      await sendEmail(email.value, subject, message);
    } catch (error) {
      console.log(`Unable to send email to ${email}`);
    }
  }
};

export const sendEmail = (email: any, subject: any, message: any) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAILER.email,
      pass: EMAILER.password,
    },
  });

  var mailOptions = {
    from: EMAILER.email,
    to: email,
    subject: subject,
    text: message,
  };

  return transporter.sendMail(mailOptions);
};
