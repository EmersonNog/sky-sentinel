// src/services/api.js
import axios from "axios";

export const fetchSatellites = async (ids) => {
  if (!ids || ids.length === 0) return [];

  try {
    const res = await axios.get(
      `http://localhost:3001/api/satellites?ids=${ids.join(",")}`
    );
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar satélites:", error);
    return [];
  }
};

export const fetchSatellitesList = async () => {
  try {
    const res = await axios.get("http://localhost:3001/api/satellites-list");
    return res.data;
  } catch (error) {
    console.error("Erro ao buscar lista de satélites:", error);
    return [];
  }
};
