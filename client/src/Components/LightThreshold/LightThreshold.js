import { Box, Typography, Slider } from "@material-ui/core";
import React from "react";

export default function LightThreshold({ lightThreshold, setLightThreshold }) {
  const handleChange = (event, newValue) => {
    setLightThreshold(newValue);
  };
  return (
    <Box>
      <Typography>Light Threshold</Typography>
      <RangeSlider handleChange={handleChange} lightThreshold={lightThreshold} />
    </Box>
  );
}

function RangeSlider({ handleChange, lightThreshold }) {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Temperature range"}
        value={lightThreshold}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={1}
        max={24}
        // getAriaValueText={valuetext}
      />
    </Box>
  );
}
