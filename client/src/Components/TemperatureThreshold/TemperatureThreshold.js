import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Slider } from "@material-ui/core";

export default function TemperatureThreshold({ temperatureThreshold, setTemperatureThreshold }) {
  const handleChange = (event, newValue) => {
    setTemperatureThreshold(newValue);
  };
  return (
    <Box display="flex" flexDirection="column">
      <Typography>TemperatureThreshold</Typography>
      <Slider
        valueLabelDisplay="auto"
        value={temperatureThreshold}
        min={0}
        max={50}
        defaultValue={20}
        onChange={handleChange}
      />
    </Box>
  );
}
