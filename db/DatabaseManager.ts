import mongoose from "mongoose";
import KEYS from "../config/keys";
import MODELS from "../db/models";
const {} = MODELS;
const { MONGO } = KEYS.default;

const URL = MONGO.URL;

class DatabaseManager {
  connected: boolean = false;

  connect = async () => {
    try {
      await mongoose.connect(URL, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.connected = true;
    } catch (error) {
      throw error;
    }
  };
  // deleteAssetCollection = async () => {
  //   var conn = mongoose.connection;
  //   // check if the connection exists
  //   var collection = await conn.db.listCollections({ name: "assets" });
  //   var collection_arr = await collection.toArray();
  //   if (collection_arr.length > 0) {
  //     // delete the table
  //     await Asset.collection.drop();
  //   }
  // };

  deleteAllCollections = async () => {
    var conn = mongoose.connection;

    // Get all collections
    const collections = await conn.db.listCollections().toArray();
    // Create an array of collection names and drop each collection
    if (collections.length > 0) {
      return await Promise.all(
        collections.map(async (collection: any) => {
          await conn.db.dropCollection(collection.name);
        })
      );
    }
  };
  close = async () => {
    return await mongoose.connection.close();
  };
}

export default DatabaseManager;
