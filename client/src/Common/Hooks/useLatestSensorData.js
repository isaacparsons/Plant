import React, { useState, useEffect } from "react";

export default function useLatestSensorData(plant) {
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);

  useEffect(() => {
    if (plant) {
      var { temperature, humidity, soil, light } = plant;
      if (temperature.length > 0) {
        var latestTemperature = temperature[0];
        setCurrentTemperature(latestTemperature);
      }
      if (humidity.length > 0) {
        var latestHumidity = temperature[0];
        setCurrentHumidity(latestHumidity);
      }
      if (soil.length > 0) {
        var latestSoilMoisture = soil[0];
        setCurrentSoilMoisture(latestSoilMoisture);
      }
      if (light.length > 0) {
        var latestLight = light[0];
        setCurrentLight(latestLight);
      }
    }
  }, [plant]);

  return {
    temperature: currentTemperature,
    humidity: currentHumidity,
    soilMoisture: currentSoilMoisture,
    light: currentLight,
  };
}
