import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 3001;
dotenv.config();

app.use(cors());

// Rota 1: Lista de satélites a partir do SatNOGS
app.get("/api/satellites-list", async (req, res) => {
  try {
    const response = await axios.get("https://db.satnogs.org/api/satellites/");
    const parsed = response.data.map((sat) => ({
      id: sat.norad_cat_id,
      name: sat.name || `SAT-${sat.norad_cat_id}`,
    }));
    res.json(parsed);
  } catch (error) {
    console.error("Erro ao buscar lista do SatNOGS:", error.message);
    res.status(500).json({
      message: "Erro ao buscar lista de satélites do SatNOGS",
      error: error.message,
    });
  }
});

// Rota 2: posição em tempo real com API N2YO
app.get("/api/satellites", async (req, res) => {
  const API_KEY = process.env.N2YO_API_KEY;
  const ids = req.query.ids?.split(",").map((id) => id.trim());

  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "Nenhum ID fornecido" });
  }

  try {
    const results = await Promise.all(
      ids.map(async (satId) => {
        // 1. Dados de posição da N2YO
        const n2yoUrl = `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/0/0/0/1?apiKey=${API_KEY}`;
        const n2yoRes = await axios.get(n2yoUrl);
        const data = n2yoRes.data.positions?.[0];
        const info = n2yoRes.data.info;

        // 2. Metadados da SatNOGS
        const satnogsRes = await axios.get(
          `https://db.satnogs.org/api/satellites/?norad_cat_id=${satId}`
        );
        const meta = satnogsRes.data?.[0] || {};

        return {
          id: satId,
          name: info?.satname || meta?.name || `SAT-${satId}`,
          latitude: data?.satlatitude ?? null,
          longitude: data?.satlongitude ?? null,
          altitude: data?.sataltitude ?? null,
          speed: data?.satvelocity ?? null,
          status: meta.status || "desconhecido",
          image: meta.image || null,
          launched: meta.launched || null,
          countries: Array.isArray(meta.countries)
            ? meta.countries
            : meta.countries
            ? [meta.countries]
            : [],
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Erro ao buscar dados combinados:", error.message);
    res.status(500).json({
      message: "Erro ao buscar informações dos satélites",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🛰️ Servidor proxy rodando em http://localhost:${port}`);
});
