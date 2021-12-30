import request from "supertest";
import app from "../server/index";
import mongoose from "mongoose";
import KEYS from "../config/keys";
const { MONGO } = KEYS.default;
import { deleteAllCollections } from "../controllers/db";
import UserService from "../services/user";
import DatabaseManager from "../db/DatabaseManager";

const URL = MONGO.URL;

// tests:
// login user - success (valid account name)
// login user - fail (invalid account name)

describe("Endpoint Tests", () => {
  var databaseManager = new DatabaseManager();
  beforeAll(async () => {
    await databaseManager.connect();
    await databaseManager.deleteAllCollections();
  });
  it("POST /api/user/signup - SUCCESS", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "isaac.2962@gmail.com";
    var password = "test";
    const res = await request(app).post(`/api/user/signup`).send({
      accountName: accountName,
      password: password,
    });
    expect(res.statusCode).toEqual(200);
  });
  it("POST /api/user/signup - FAIL no account name", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "isaac.2962@gmail.com";
    const res = await request(app).post(`/api/user/signup`).send({
      accountName: accountName,
      password: "",
    });
    expect(res.statusCode).toEqual(400);
  });
  it("POST /api/user/signup - FAIL account already exists", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "isaac.2962@gmail.com";
    var password = "test";
    await UserService.createUser(accountName, password);
    const res = await request(app).post(`/api/user/signup`).send({
      accountName: accountName,
      password: password,
    });
    expect(res.statusCode).toEqual(400);
  });
  it("GET /api/user/login - SUCCESS", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "isaac.2962@gmail.com";
    var password = "test";
    await UserService.createUser(accountName, password);
    const res = await request(app).get(`/api/user/login?accountName=${accountName}&password=${password}`);
    expect(res.statusCode).toEqual(200);
  });
  it("GET /api/user/login - FAIL user doesnt exist", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "test@gmail.com";
    var password = "test";
    const res = await request(app).get(`/api/user/login?accountName=${accountName}&password=${password}`);
    expect(res.statusCode).toEqual(400);
  });
  it("GET /api/user/login - FAIL incorrect password", async () => {
    await databaseManager.deleteAllCollections();
    var accountName = "isaac.2962@gmail.com";
    var password = "test";
    await UserService.createUser(accountName, password);
    const res = await request(app).get(`/api/user/login?accountName=${accountName}&password=${"123"}`);
    expect(res.statusCode).toEqual(400);
  });
  afterAll(async () => {
    await databaseManager.deleteAllCollections();
    await databaseManager.close();
  });
});
