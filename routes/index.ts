import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import MONGO from "../config/keys";
import PlantController from "../controllers/plants";
import { successResponseFormat } from "../utils/response";

router.post("/plant", async (req: any, res: any, next: any) => {
  try {
    var { name, deviceId } = req.body;
    var plant = await PlantController.createPlant(name, deviceId);
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});
router.get("/plant/:id", async (req: any, res: any, next: any) => {
  try {
    var { id } = req.params;
    var plant = await PlantController.getPlant(id);
    res.status(200).json(plant);
  } catch (err) {
    next(err);
  }
});
router.get("/plants", async (req: any, res: any, next: any) => {
  try {
    var plants = await PlantController.getPlants();
    res.status(200).json(plants);
  } catch (err) {
    next(err);
  }
});
router.post("/plant_settings/:id", async (req: any, res: any, next: any) => {
  try {
    var { id } = req.params;
    var { moistureThreshold, temperatureThreshold, lightStart, lightEnd } = req.body;
    var plantSettings = await PlantController.createPlantSettings(
      id,
      moistureThreshold,
      temperatureThreshold,
      lightStart,
      lightEnd
    );
    res.status(200).json(plantSettings);
  } catch (err) {
    next(err);
  }
});
router.get("/plant_settings/:id", async (req: any, res: any, next: any) => {
  try {
    var { id } = req.params;
    var plantSettings = await PlantController.getPlantSettings(id);
    res.status(200).json(plantSettings);
  } catch (err) {
    next(err);
  }
});
router.get("/sensor_data/:id", async (req: any, res: any, next: any) => {
  try {
    var { id } = req.params;
    var sensorData = await PlantController.getPlantData(id);
    res.status(200).json(sensorData);
  } catch (err) {
    next(err);
  }
});
router.post("/sensor_data/:id", async (req: any, res: any, next: any) => {
  try {
    var { id } = req.params;
    var { temperature, humidity, moisture, lightOn } = req.body;

    var sensorData = await PlantController.createPlantData(
      parseInt(id),
      new Date(),
      parseFloat(temperature),
      parseFloat(humidity),
      parseFloat(moisture),
      lightOn
    );
    res.status(200).json(sensorData);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
