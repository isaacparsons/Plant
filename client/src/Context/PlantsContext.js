import React, { useContext, useState, createContext, useEffect } from "react";
import api from "../Api/Backend";

export function useProvidePlants() {
  const [plants, setPlants] = useState([]);

  const fetchPlantData = async () => {
    try {
      var _plants = await api.getPlants();

      var plantsWithData = await Promise.all(
        _plants.map(async (plant) => {
          var { deviceId } = plant;
          var plantSettings = await api.getPlantSettings(deviceId);
          var sensorData = await api.getSensorData(deviceId);

          return {
            ...plant,
            plantSettings: plantSettings,
            sensorData: sensorData,
          };
        })
      );
      setPlants(plantsWithData);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPlantData();
  }, []);

  const getPlant = (id) => {
    var plant = plants.find((item) => parseInt(item.deviceId) === parseInt(id));
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
