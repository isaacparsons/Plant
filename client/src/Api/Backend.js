const axios = require("axios");

const _get = async (uri) => {
  const response = await axios.get(uri, { timeout: 10000 });
  if (response.status === 200) {
    return response.data;
  } else throw new Error(response.data.error);
};
const _post = async (uri, body) => {
  try {
    const response = await axios.post(uri, body, { timeout: 10000 });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const _put = async (uri, body) => {
  try {
    const response = await axios.put(uri, body, { timeout: 10000 });
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
const _delete = async (uri) => {
  try {
    const response = await axios.delete(uri, { timeout: 10000 });
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

const api = {
  getPlants: async () => _get(`/api/plants/`),
  getPlant: async (id) => _get(`/api/plant/${id}`),
  getSensorData: async (plantId) => _get(`/api/sensor_data/${plantId}`),
  createPlantSettings: async (plantId, body) => _post(`/api/plant_settings/${plantId}`, body),
};
export default api;
