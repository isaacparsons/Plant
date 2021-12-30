import { Box, Typography, Slider } from "@material-ui/core";
import React from "react";

export default function LightThreshold() {
  return (
    <Box>
      <Typography>Light Threshold</Typography>
      <RangeSlider />
    </Box>
  );
}

function RangeSlider() {
  const [value, setValue] = React.useState([1, 24]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        // getAriaValueText={valuetext}
      />
    </Box>
  );
}
