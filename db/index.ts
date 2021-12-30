import mongoose from "mongoose";
import KEYS from "../config/keys";
const { MONGO } = KEYS.default;

const URL = MONGO.URL;

export const connectToDb = async () => {
  try {
    await mongoose.connect(URL, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw error;
  }
};
