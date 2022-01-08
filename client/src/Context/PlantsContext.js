import React, { useContext, useState, createContext, useEffect } from "react";
import api from "../Api/Backend";

export function useProvidePlants() {
  const [plants, setPlants] = useState([]);

  const fetchPlantData = async () => {
    var _plants = await api.getPlants();

    var plantsWithData = await Promise.all(
      _plants.map(async (plant) => {
        var { _id } = plant;
        var plantSettings = await api.getPlant(_id);
        var sensorData = await api.getSensorData(_id);
        var temperatureData = sensorData.map((item) => {
          return { date: item.date, value: item.temperature };
        });
        var humidityData = sensorData.map((item) => {
          return { date: item.date, value: item.humidity };
        });
        var soilData = sensorData.map((item) => {
          return { date: item.date, value: item.moisture };
        });
        var lightData = sensorData.map((item) => {
          return { date: item.date, value: item.lightOn };
        });
        return {
          ...plant,
          ...plantSettings,
          temperature: temperatureData,
          humidity: humidityData,
          soil: soilData,
          light: lightData,
        };
      })
    );
    setPlants(plantsWithData);
  };

  useEffect(() => {
    fetchPlantData();
  }, []);

  const getPlant = (id) => {
    var plant = plants.find((item) => item._id === id);
    return plant;
  };

  return {
    plants,
    setPlants,
    getPlant,
  };
}
export function usePlants() {
  return useContext(plantsContext);
}
const plantsContext = createContext();

export function ProvidePlants({ children }) {
  const plants = useProvidePlants();
  return <plantsContext.Provider value={plants}>{children}</plantsContext.Provider>;
}
