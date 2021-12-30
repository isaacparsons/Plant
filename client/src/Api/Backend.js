const axios = require("axios");

const _get = async (uri) => {
  const response = await axios.get(uri, { timeout: 10000 });
  if (response.status === 200) {
    return response.data.data;
  } else throw new Error(response.data.error);
};
const _post = async (uri, body) => {
  try {
    const response = await axios.post(uri, body, { timeout: 10000 });
    if (response.status === 200) {
      return response.data.data;
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
  login: async (accountName, password) => _get(`/api/user/login?accountName=${accountName}&password=${password}`),
  signup: async (accountName, password) =>
    _post(`/api/user/signup`, {
      accountName: accountName,
      password: password,
    }),
  getAssets: async () => _get(`/api/assets`),
  getAsset: async (assetId) => _get(`/api/asset/${assetId}`),
  followAsset: async (userId, assetId) => _post(`/api/user/${userId}/asset/${assetId}/follow`),
  unfollowAsset: async (userId, assetId) => _delete(`/api/user/${userId}/asset/${assetId}/follow`),
  getFollowedAssets: async (userId) => _get(`/api/user/${userId}/following`),
  getAlerts: async (userId) => _get(`/api/alerts/${userId}`),
  updateAlert: async (alertId, alert) => _put(`/api/alert/${alertId}`, alert),
  updateAlerts: async (alerts) => _put(`/api/alerts`, alerts),
  getConnections: async () => _get(`/api/connections`),
  getDispatches: async () => _get(`/api/dispatches`),
  getEnergyData: async (assetId, startDate, endDate) =>
    _get(`/api/asset/${assetId}/energy?startDate=${startDate}&endDate=${endDate}`),
  getDispatchData: async (assetId, startDate, endDate) =>
    _get(`/api/asset/${assetId}/dispatches?startDate=${startDate}&endDate=${endDate}`),
  getAlertOptions: async (assetFollowerId) => _get(`/api/alert_options/${assetFollowerId}`),
  saveAlertOptions: async (alertOptions) => _post(`/api/alert_options/${alertOptions.assetFollowerId}`, alertOptions),
  deleteAll: async () => _post(`/api/delete_all`, {}),
};
export default api;
