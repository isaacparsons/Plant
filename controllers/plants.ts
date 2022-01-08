import MODELS from "../db/models";
const { Plant, PlantSetting, SensorData, Water } = MODELS;

const createPlant = async (name: any, i2cAddr: any) => {
  var plant = new Plant({
    name: name,
    i2cAddr: i2cAddr,
  });
  await plant.save();
  return plant;
};

const getPlants = async () => {
  return await Plant.find({});
};

const getPlant = async (plantId: any) => {
  var plant = await Plant.findOne({ _id: plantId });
  var plantSettings = await getPlantSettings(plantId);
  var plantSensorData = await SensorData.find({ plantId: plantId });
  return {
    _id: plant._id,
    name: plant.name,
    i2cAddr: plant.i2cAddr,
    plantSettings: plantSettings,
    sensorData: plantSensorData,
  };
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
