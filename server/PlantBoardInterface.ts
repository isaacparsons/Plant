import cron from "node-cron";
const i2c = require("i2c-bus");
const ADDR = 8;
import PlantController from "../controllers/plants";

const getDataFromI2c = async (addr: any, cmd: any) => {
  const wbuf = Buffer.from([cmd]);
  const rbuf = Buffer.alloc(4);
  var response = null;
  i2c
    .openPromisified(1)
    .then((i2c1: any) =>
      i2c1
        .i2cWrite(addr, wbuf.length, wbuf)
        .then((_: any) => i2c1.i2cRead(addr, 4, rbuf))
        .then((data: any) => {
          response = data.buffer.readFloatLE();
        })
        .then((_: any) => i2c1.close())
    )
    .catch(console.log);
  return response;
};

const fetchPlantSensorData = async () => {
  // get plants from database, get i2c address, fetch data
  var plants = await PlantController.getPlants();

  try {
    var temp = await getDataFromI2c(ADDR, 1);
    var hum = await getDataFromI2c(ADDR, 2);
    var moisture = await getDataFromI2c(ADDR, 3);
    // save data to database

    console.log(temp);
    console.log(hum);
    console.log(moisture);
  } catch (error) {}
};

const callEveryMin = async () => {
  return cron.schedule("* * * * *", async function () {
    try {
      fetchPlantSensorData();
    } catch (err) {}
  });
};

callEveryMin();
