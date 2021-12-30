import { Router } from "express";
const router = Router();
import mongoose from "mongoose";
import MONGO from "../config/keys";
import ConnectionService from "../services/connection";
import { NrgError } from "../errors/Errors";
import { successResponseFormat } from "../utils/response";
import { server } from "../server";

router.get("/test", async (req: any, res: any, next: any) => {
  throw new NrgError("woops");
});

router.get("/connections", async (req: any, res: any, next: any) => {
  try {
    var nrgConnection = await ConnectionService.findConnection("nrg");
    var adamsConnection = await ConnectionService.findConnection("adams");
    res.status(200).json(successResponseFormat([nrgConnection, adamsConnection]));
  } catch (err) {
    next(err);
  }
});
router.delete("/delete_all", async (req: any, res: any, next: any) => {
  try {
    await mongoose.connect(MONGO.URL, { useNewUrlParser: true });
    await server.database.deleteAllCollections(mongoose);
    res.status(200);
  } catch (err) {
    next(err);
  }
});

export default router;
