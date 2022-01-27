import React, { useState, useEffect } from "react";

export default function useLatestSensorData(plant) {
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);

  useEffect(() => {
    if (plant && plant.sensorData.length > 0) {
      var { temperature, humidity, soil, light } = plant.sensorData[plant.sensorData.length - 1];
      setCurrentTemperature(temperature);
      setCurrentHumidity(humidity);
      setCurrentSoilMoisture(soil);
      setCurrentLight(light);
    }
  }, [plant]);

  return {
    temperature: currentTemperature,
    humidity: currentHumidity,
    soilMoisture: currentSoilMoisture,
    light: currentLight,
  };
}
