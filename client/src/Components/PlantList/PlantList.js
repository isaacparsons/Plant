import React, { useState, useEffect } from "react";
import { List, Box, Typography } from "@material-ui/core";

export default function PlantList({ data, onPlantPressed }) {
  return (
    <List>
      {data.map((item) => {
        var { id } = item;
        return (
          <Box onClick={() => onPlantPressed(id)}>
            <PlantCard plant={item} />
          </Box>
        );
      })}
    </List>
  );
}

const PlantCard = (props) => {
  var { plant } = props;
  var { name, environment, soil } = plant;
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);

  useEffect(() => {
    if (environment.length > 0) {
      var latestEnvironmentData = environment[0];
      setCurrentTemperature(latestEnvironmentData.temperature);
      setCurrentHumidity(latestEnvironmentData.humidity);
    }
  }, [environment]);

  useEffect(() => {
    if (soil.length > 0) {
      var latestSoilData = soil[0];
      setCurrentSoilMoisture(latestSoilData.moisture);
    }
  }, [soil]);
  return (
    <Box display={"flex"} flexDirection={"row"} borderRadius={10} margin={3} style={{ backgroundColor: "#D3D3D3" }}>
      <Box padding={1}>
        <Typography style={{ fontSize: 22 }}>{name}</Typography>
      </Box>
      <Box padding={1}>
        <Typography>Temperature</Typography>
        <Typography>{`${currentTemperature} C`}</Typography>
      </Box>
      <Box padding={1}>
        <Typography>Humidity</Typography>
        <Typography>{`${currentHumidity} %`}</Typography>
      </Box>
      <Box padding={1}>
        <Typography>Soil Moisture</Typography>
        <Typography>{`${currentSoilMoisture} %`}</Typography>
      </Box>
      <Box padding={1}>
        <Typography>Light</Typography>
        <Typography>{currentLight ? "ON" : "OFF"}</Typography>
      </Box>
    </Box>
  );
};
