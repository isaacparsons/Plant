import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Button, Typography, Box } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Graph from "../Components/Graph/Graph";
import TemperatureThreshold from "../Components/TemperatureThreshold/TemperatureThreshold";
import MoistureThreshold from "../Components/MoistureThreshold/MoistureThreshold";
import LightThreshold from "../Components/LightThreshold/LightThreshold";
import { usePlants } from "../Context/PlantsContext";
import useLatestSensorData from "../Common/Hooks/useLatestSensorData";
import { PlantCard } from "../Components/PlantList/PlantList";
import api from "../Api/Backend";
import PlantSettings from "../Components/PlantSettings/PlantSettings";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "auto",
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    minHeight: "100vh",
  },
}));

export const PlantDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { getPlant, plants } = usePlants();
  const [plant, setPlant] = useState(null);
  let { id } = useParams();
  const [temperatureThreshold, setTemperatureThreshold] = useState(0);
  const [moistureThreshold, setMoistureThreshold] = useState(0);
  const [lightThreshold, setLightThreshold] = useState([1, 24]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [soilData, setSoilData] = useState([]);
  const [lightData, setLightData] = useState([]);

  useEffect(() => {
    var _plant = getPlant(id);
    console.log(_plant);
    parseSensorData(_plant);
    setPlant(_plant);
  }, [id, plants]);

  const parseSensorData = (plant) => {
    if (plant && plant.sensorData && plant.sensorData.length > 0) {
      var temperature = [];
      var humidty = [];
      var soil = [];
      var light = [];
      plant.sensorData.forEach((item) => {
        temperature.push({ value: item.temperature, date: new Date(item.date).getTime() });
        humidty.push({ value: item.humidity, date: new Date(item.date).getTime() });
        soil.push({ value: item.moisture, date: new Date(item.date).getTime() });
        light.push({ value: item.lightOn, date: new Date(item.date).getTime() });
      });

      setTemperatureData(temperature);
      setHumidityData(humidty);
      setSoilData(soil);
      setLightData(light);
    }
  };

  const onBackPressed = () => {
    history.replace(`/`);
  };

  const handleSavePress = async () => {
    try {
      await api.createPlantSettings(id, {
        plantId: id,
        moistureThreshold: moistureThreshold,
        temperatureThreshold: temperatureThreshold,
        lightStart: lightThreshold[0],
        lightEnd: lightThreshold[1],
      });
    } catch (error) {}
  };

  return (
    <div className={classes.root}>
      <Container style={{ paddingTop: 20 }}>
        <Button onClick={onBackPressed}>Back</Button>
        <PlantCard plant={plant} />
        <PlantSettings
          temperatureThreshold={temperatureThreshold}
          setTemperatureThreshold={setTemperatureThreshold}
          moistureThreshold={moistureThreshold}
          setMoistureThreshold={setMoistureThreshold}
          lightThreshold={lightThreshold}
          setLightThreshold={setLightThreshold}
          handleSavePress={handleSavePress}
        />
        <Graph title={"Temperature"} data={temperatureData} />
        <Graph title={"Humidity"} data={humidityData} />
        <Graph title={"Soil"} data={soilData} />
        <Graph title={"Light"} data={lightData} type={"step"} yTickFormatter={(item) => (item ? 1 : 0)} />
      </Container>
    </div>
  );
};

export default PlantDetails;
