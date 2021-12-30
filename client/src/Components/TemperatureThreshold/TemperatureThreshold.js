import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Slider } from "@material-ui/core";

export default function TemperatureThreshold() {
  return (
    <Box display="flex" flexDirection="column">
      <Typography>TemperatureThreshold</Typography>
      <Slider defaultValue={30} aria-label="Disabled slider" />
    </Box>
  );
}
