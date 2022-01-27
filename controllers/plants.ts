import MODELS from "../db/models";
const { Plant, PlantSetting, SensorData, Water } = MODELS;

const createPlant = async (name: any, deviceId: any) => {
  var plant = new Plant({
    name: name,
    deviceId: deviceId,
  });
  await plant.save();
  return plant;
};

const getPlants = async () => {
  return await Plant.find({});
};

const getPlant = async (plantId: any) => {
  var plant = await Plant.findOne({ deviceId: plantId });
  return plant;
};

const getPlantSettings = async (plantId: any) => {
  return await PlantSetting.findOne({ plantId: plantId });
};

const createPlantSettings = async (
  plantId: any,
  moistureThreshold: any,
  temperatureThreshold: any,
  lightStart: any,
  lightEnd: any
) => {
  var existingPlantSettings = await getPlantSettings(plantId);
  if (existingPlantSettings) {
    await PlantSetting.deleteOne({ plantId: plantId });
  }
  var plantSettings = new PlantSetting({
    plantId: plantId,
    moistureThreshold: moistureThreshold,
    temperatureThreshold: temperatureThreshold,
    lightStart: lightStart,
    lightEnd: lightEnd,
  });
  await plantSettings.save();
  return plantSettings;
};

const createPlantData = async (
  plantId: any,
  date: any,
  temperature: any,
  humidity: any,
  moisture: any,
  lightOn: boolean
) => {
  var sensorData = new SensorData({
    plantId: plantId,
    date: date,
    temperature: temperature,
    humidity: humidity,
    moisture: moisture,
    lightOn: lightOn,
  });
  await sensorData.save();
  return sensorData;
};

const getPlantData = async (plantId: any) => {
  return await SensorData.find({ plantId: plantId });
};

export default {
  getPlants,
  getPlant,
  createPlant,
  getPlantSettings,
  createPlantSettings,
  createPlantData,
  getPlantData,
};
