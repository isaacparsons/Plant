import React, { useState, useEffect } from "react";
import { List, Box, Typography } from "@material-ui/core";
import useLatestSensorData from "../../Common/Hooks/useLatestSensorData";

export default function PlantList({ data, onPlantPressed }) {
  return (
    <List>
      {data.map((item) => {
        var { deviceId } = item;
        return (
          <Box onClick={() => onPlantPressed(deviceId)}>
            <PlantCard plant={item} />
          </Box>
        );
      })}
    </List>
  );
}

export const PlantCard = (props) => {
  var { plant } = props;
  const latestSensorData = useLatestSensorData(plant);

  if (plant) {
    var { name } = plant;
    var temperature = latestSensorData.temperature ? `${latestSensorData.temperature} C` : "None";
    var humidity = latestSensorData.humidity ? `${latestSensorData.humidity} %` : "None";
    var soilMoisture = latestSensorData.soilMoisture ? `${latestSensorData.soilMoisture} %` : "None";
    var light = latestSensorData.light ? latestSensorData.light : "None";

    return (
      <Box display={"flex"} flexDirection={"row"} borderRadius={10} margin={3} style={{ backgroundColor: "#D3D3D3" }}>
        <Box padding={1}>
          <Typography style={{ fontSize: 22 }}>{name}</Typography>
        </Box>
        <Box padding={1}>
          <Typography>Temperature</Typography>
          <Typography>{temperature}</Typography>
        </Box>
        <Box padding={1}>
          <Typography>Humidity</Typography>
          <Typography>{humidity}</Typography>
        </Box>
        <Box padding={1}>
          <Typography>Soil Moisture</Typography>
          <Typography>{soilMoisture}</Typography>
        </Box>
        <Box padding={1}>
          <Typography>Light</Typography>
          <Typography>{latestSensorData.light ? "ON" : "OFF"}</Typography>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box display={"flex"} flexDirection={"row"} borderRadius={10} margin={3} style={{ backgroundColor: "#D3D3D3" }}>
        <Box padding={1}>
          <Typography style={{ fontSize: 22 }}>{"No data available"}</Typography>
        </Box>
      </Box>
    );
  }
};
