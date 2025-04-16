// src/services/api.js
import axios from "axios";

const BASE_URL = "https://sky-sentinel-production.up.railway.app";

export const fetchSatellites = async (ids) => {
  if (!ids || ids.length === 0) return [];

  try {
    const res = await axios.get(
      `${BASE_URL}/api/satellites?ids=${ids.join(",")}`
    );
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar satélites:", error);
    return [];
  }
};

export const fetchSatellitesList = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/satellites-list`);
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar lista de satélites:", error);
    return [];
  }
};
