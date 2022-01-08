import { Schema, SchemaTypes, model } from "mongoose";

const plants = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    i2cAddr: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const plantSettings = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    moistureThreshold: {
      type: Number,
      required: true,
    },
    temperatureThreshold: {
      type: Number,
      required: true,
    },
    lightStart: {
      type: Number,
      required: true,
    },
    lightEnd: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const plantDetails = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    height: String,
    age: String,
    type: String,
  },
  { timestamps: true }
);
const sensorData = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    moisture: {
      type: Number,
      required: true,
    },
    lightOn: {
      type: Number,
      required: true,
    },
    date: Date,
  },
  { timestamps: true }
);

const water = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    amount: Number,
    units: String,
    date: Date,
  },
  { timestamps: true }
);

const Plant = model("Plant", plants);
const PlantSetting = model("PlantSetting", plantSettings);
const PlantDetail = model("PlantDetail", plantDetails);
const SensorData = model("SensorData", sensorData);
const Water = model("Water", water);

export default {
  Plant,
  PlantSetting,
  PlantDetail,
  SensorData,
  Water,
};
