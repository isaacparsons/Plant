import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Slider } from "@material-ui/core";

export default function MoistureThreshold() {
  return (
    <Box display="flex" flexDirection="column">
      <Typography>MoistureThreshold</Typography>
      <Slider defaultValue={30} aria-label="Disabled slider" />
    </Box>
  );
}
