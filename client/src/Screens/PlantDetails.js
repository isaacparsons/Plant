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
  const { getPlant } = usePlants();
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
    setPlant(_plant);
  }, [id]);

  useEffect(() => {
    if (plant) {
      console.log(plant);
      var { temperature, humidity, light, soil, plantSettings } = plant;
      var { moistureThreshold, temperatureThreshold, lightStart, lightEnd } = plantSettings;
      setMoistureThreshold(moistureThreshold);
      setTemperatureThreshold(temperatureThreshold);
      setLightThreshold([lightStart, lightEnd]);
      setSoilData(soil);
      setTemperatureData(temperature);
      setHumidityData(humidity);
      setLightData(light);
    }
  }, [plant]);

  const onBackPressed = () => {
    history.replace(`/`);
  };

  const handleSavePress = async () => {
    var plantSettings = await api.createPlantSettings(id, {
      plantId: id,
      moistureThreshold: moistureThreshold,
      temperatureThreshold: temperatureThreshold,
      lightStart: lightThreshold[0],
      lightEnd: lightThreshold[1],
    });
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

const PlantSettings = ({
  temperatureThreshold,
  setTemperatureThreshold,
  moistureThreshold,
  setMoistureThreshold,
  lightThreshold,
  setLightThreshold,
  handleSavePress,
}) => {
  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems={"flex-start"}
      padding={1}
      style={{ backgroundColor: "#D3D3D3", borderRadius: 20 }}
    >
      <Typography>Plant Settings</Typography>
      <Box display="flex" width={"100%"}>
        <Box display="flex" flexDirection={"column"} width={"50%"} margin={2}>
          <TemperatureThreshold
            temperatureThreshold={temperatureThreshold}
            setTemperatureThreshold={setTemperatureThreshold}
          />
          <MoistureThreshold moistureThreshold={moistureThreshold} setMoistureThreshold={setMoistureThreshold} />
        </Box>
        <Box display="flex" flexDirection={"column"} width={"50%"} margin={2}>
          <LightThreshold lightThreshold={lightThreshold} setLightThreshold={setLightThreshold} />
        </Box>
      </Box>
      <Button onClick={handleSavePress}>Save</Button>
    </Box>
  );
};

export default PlantDetails;
