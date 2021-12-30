import request from "supertest";
import app from "../server/index";
import mongoose from "mongoose";
import KEYS from "../config/keys";
import DatabaseManager from "../db/DatabaseManager";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import UserService from "../services/user";
import AssetService from "../services/assets";
import AssetController from "../controllers/assets";

const URL = MONGO.URL;

// test:
// get asset - success (valid assetId)
// get asset - fail (invalid assetId)
// get dispatches - success (valid assetId, valid dates)
// get dispatches - fail (invalid assetId, valid dates)
// get dispatches - fail (valid assetId, invalid dates)
// get energy - success (valid assetId, valid dates)
// get energy - fail (invalid assetId, valid dates)
// get energy - fail (valid assetId, invalid dates)
// get following - success (valid userId)
// get following - fail (invalid userId)
// follow asset - success (valid userId, valid assetId)
// follow asset - fail (invalid userId, valid assetId)
// follow asset - fail (valid userId, invalid assetId)
// unfollow asset - success (valid userId, valid assetId)
// unfollow asset - fail (invalid userId, valid assetId)
// unfollow asset - fail (valid userId, invalid assetId)

describe("API Tests", () => {
  var databaseManager = new DatabaseManager();
  beforeAll(async () => {
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
  });
  it("test", async () => {});
  // it("POST /api/user/:userId/asset/:assetId/follow - 200 - success", async () => {
  //   await deleteAllCollections(mongoose);

  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var userId = user._id;
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });

  //   const res = await request(app).post(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("POST /api/user/:userId/asset/:assetId/follow - 400 - invalid userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var userId = "123";
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   const res = await request(app).post(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("POST /api/user/:userId/asset/:assetId/follow - 400 - invalid asseId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var userId = user._id;
  //   var assetId = "ABC1";
  //   const res = await request(app).post(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("POST /api/user/:userId/asset/assetId/follow - 400 - already following asset", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   var userId = user._id;
  //   await AssetController.followAsset(userId, assetId);

  //   const res = await request(app).post(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body.status).toEqual("error");
  // });
  // it("DELETE /api/user/:userId/asset/assetId/follow - 200 - success", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   var userId = user._id;
  //   await AssetController.followAsset(userId, assetId);

  //   const res = await request(app).delete(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("DELETE /api/user/:userId/asset/assetId/follow - 400 - invalid userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   var userId = "123";
  //   const res = await request(app).delete(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("DELETE /api/user/:userId/asset/assetId/follow - 400 - invalid assetId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user = await UserService.createUser("gang@gmail.com", "test");
  //   var assetId = "ABC1";
  //   var userId = user._id;
  //   const res = await request(app).delete(`/api/user/${userId}/asset/${assetId}/follow`);
  //   expect(res.statusCode).toEqual(400);
  // });
  // it("GET /user/:userId/following - 200 - success", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   var user1 = await UserService.createUser("gang1@gmail.com", "test");
  //   var user2 = await UserService.createUser("gang2@gmail.com", "test");
  //   await AssetController.followAsset(user1._id, assetId);
  //   await AssetController.followAsset(user2._id, assetId);

  //   const res = await request(app).get(`/api/user/${user1._id}/following`);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data.length).toEqual(1);
  //   expect(res.body.data[0].userId).toEqual(user1._id.toString());
  // });
  // it("GET /user/:userId/following - 400 - invalid userId", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ name: "test asset", assetId: assetId });
  //   var user1 = await UserService.createUser("gang1@gmail.com", "test");
  //   var user2 = await UserService.createUser("gang2@gmail.com", "test");
  //   await AssetController.followAsset(user1._id, assetId);
  //   await AssetController.followAsset(user2._id, assetId);

  //   const res = await request(app).get(`/api/user/123/following`);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body.status).toEqual("error");
  // });
  // it("GET /user/:userId/following - 200 - not following any", async () => {
  //   await deleteAllCollections(mongoose);
  //   var user1 = await UserService.createUser("gang1@gmail.com", "test");

  //   const res = await request(app).get(`/api/user/${user1._id}/following`);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.data.length).toEqual(0);
  // });
  // it("GET /api/asset/:assetId - success", async () => {
  //   await deleteAllCollections(mongoose);
  //   var assetId = "ABC1";
  //   await AssetService.createAsset({ assetId: assetId, name: "test asset" });
  //   const res = await request(app).get(`/api/asset/${assetId}`);
  //   expect(res.statusCode).toEqual(200);
  // });
  // it("GET /api/asset/:assetId - asset doesnt exist", async () => {
  //   await deleteAllCollections(mongoose);
  //   const res = await request(app).get(`/api/asset/${""}`);
  //   expect(res.statusCode).toEqual(404);
  // });

  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
