// src/views/HomeView.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { SatelliteMap } from "../components/SatelliteMap";
import logo from "../assets/logo.png";

export const HomeView = () => {
  const [satelliteList, setSatelliteList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const satellitesPerPage = 10;

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/api/satellites-list")
      .then((res) => {
        setSatelliteList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar lista:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSatellites([]);
      return;
    }

    const fetchSatellites = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/satellites?ids=${selectedIds.join(",")}`
        );
        setSatellites(res.data);
      } catch (err) {
        console.error("Erro ao buscar posições:", err);
      }
    };

    fetchSatellites();
    const interval = setInterval(fetchSatellites, 10000);
    return () => clearInterval(interval);
  }, [selectedIds]);

  const handleChange = (e) => {
    const id = e.target.value;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredList = satelliteList.filter(
    (sat) =>
      sat &&
      sat.id &&
      sat.name &&
      sat.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * satellitesPerPage;
  const indexOfFirst = indexOfLast - satellitesPerPage;
  const currentSatellites = filteredList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredList.length / satellitesPerPage);

  const hasOnlyInvalidSatellites =
    satellites.length > 0 &&
    satellites.every((sat) => sat.latitude == null || sat.longitude == null);

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}
    >
      <aside
        style={{
          width: "260px",
          padding: "15px",
          backgroundColor: "#ffffff",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
      >
        <img
          src={logo}
          alt="Sky Sentinel Logo"
          style={{ width: "100%", maxWidth: "300px", marginBottom: "1rem" }}
        />

        <input
          type="text"
          placeholder="🔎 Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "93%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {loading ? (
            <p style={{ color: "#666" }}>Carregando satélites...</p>
          ) : (
            currentSatellites.map((sat) => {
              const isSelected = selectedIds.includes(sat.id.toString());
              return (
                <label
                  key={sat.id}
                  htmlFor={`sat-${sat.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#444",
                    padding: "6px 8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? "#e0f7fa" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    value={sat.id}
                    id={`sat-${sat.id}`}
                    onChange={handleChange}
                    checked={isSelected}
                  />
                  {sat.name}
                </label>
              );
            })
          )}
        </div>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ◀
          </button>
          <span style={{ fontSize: "13px", color: "#555" }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ▶
          </button>
        </div>
      </aside>
      {hasOnlyInvalidSatellites && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffe0e0",
            color: "#900",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          🚫 Localização desconhecida para os satélites selecionados.
        </div>
      )}

      <main style={{ flex: 1 }}>
        <SatelliteMap
          satellites={satellites.filter(
            (sat) => sat && sat.id && sat.latitude && sat.longitude
          )}
        />
      </main>
    </div>
  );
};
