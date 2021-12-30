import { Schema, SchemaTypes, model } from "mongoose";

const plants = new Schema(
  {
    name: {
      type: String,
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
const environment = new Schema(
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
  },
  { timestamps: true, capped: { max: 200 } }
);
const soil = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    moisture: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const light = new Schema(
  {
    plantId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    isOn: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Plant = model("Plant", plants);
const PlantSetting = model("PlantSetting", plantSettings);
const PlantDetail = model("PlantDetail", plantDetails);
const Environment = model("Environment", environment);
const Soil = model("Soil", soil);
const Light = model("Light", light);

export default {
  Plant,
  PlantSetting,
  PlantDetail,
  Environment,
  Soil,
  Light,
};
