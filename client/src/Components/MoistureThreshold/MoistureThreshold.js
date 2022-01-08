import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Slider } from "@material-ui/core";

export default function MoistureThreshold({ moistureThreshold, setMoistureThreshold }) {
  const handleChange = (event, newValue) => {
    setMoistureThreshold(newValue);
  };
  return (
    <Box display="flex" flexDirection="column">
      <Typography>MoistureThreshold</Typography>
      <Slider valueLabelDisplay="auto" defaultValue={30} value={moistureThreshold} onChange={handleChange} />
    </Box>
  );
}
