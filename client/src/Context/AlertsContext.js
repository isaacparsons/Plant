import React, { useContext, useState, createContext, useEffect } from "react";
import api from "../Api/Backend";

export function useProvideAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    refresh();
  }, [userId]);

  const refresh = async () => {
    if (userId) {
      try {
        setLoading(true);
        var _alerts = await api.getAlerts(userId);
        setAlerts(_alerts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    alerts,
    refresh,
    setUserId,
  };
}
export function useAlerts() {
  return useContext(alertsContext);
}
const alertsContext = createContext();
export function ProvideAlerts({ children }) {
  const alerts = useProvideAlerts();
  return <alertsContext.Provider value={alerts}>{children}</alertsContext.Provider>;
}
