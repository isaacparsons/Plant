import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@material-ui/core";
import LightThreshold from "../LightThreshold/LightThreshold";
import MoistureThreshold from "../MoistureThreshold/MoistureThreshold";
import TemperatureThreshold from "../TemperatureThreshold/TemperatureThreshold";

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

export default PlantSettings;
