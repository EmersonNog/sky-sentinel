// src/App.jsx
import { useEffect, useState } from "react";
import { GlobeScene } from "./components/GlobeScene/GlobeScene";
import { fetchSatellites, fetchSatellitesList } from "./services/api";
import { Sidebar } from "./components/Sidebar/Sidebar";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.div`
  margin-left: 190px;
  flex: 1;
  height: 100vh;
  width: calc(100vw - 150px);
  @media (max-width: 768px) {
    margin-left: 80px;
    width: calc(100vw - 80px);
  }
`;

function App() {
  const [satelliteList, setSatelliteList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const satellitesPerPage = 10;

  // busca filtrada
  const filteredSatellites = satelliteList.filter((sat) =>
    sat.name.toLowerCase().includes(search.toLowerCase())
  );

  // paginação da interface lateral
  const paginatedSatellites = search
    ? filteredSatellites.slice(0, satellitesPerPage)
    : satelliteList.slice(
        (currentPage - 1) * satellitesPerPage,
        currentPage * satellitesPerPage
      );

  const totalPages = search
    ? 1
    : Math.ceil(satelliteList.length / satellitesPerPage);

  // carregar lista básica com nome e id
  useEffect(() => {
    const loadList = async () => {
      const list = await fetchSatellitesList();
      setSatelliteList(list);
    };
    loadList();
  }, []);

  // carregar dados completos dos satélites selecionados (em lotes)
  useEffect(() => {
    const loadSelectedSatellites = async () => {
      if (selectedIds.length === 0) {
        setSatellites([]);
        return;
      }

      const batchSize = 10;
      const batches = [];

      for (let i = 0; i < selectedIds.length; i += batchSize) {
        const batch = selectedIds.slice(i, i + batchSize);
        batches.push(fetchSatellites(batch));
      }

      const results = await Promise.all(batches);
      const merged = results.flat();
      setSatellites(merged);
    };

    loadSelectedSatellites();
  }, [selectedIds]);

  return (
    <AppContainer>
      <Sidebar>
        <input
          type="text"
          placeholder="Buscar satélite..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="sidebar-search"
        />
        <ul>
          {paginatedSatellites.map((sat) => (
            <li key={sat.id}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(sat.id)}
                  onChange={() => {
                    setSelectedIds((prev) =>
                      prev.includes(sat.id)
                        ? prev.filter((id) => id !== sat.id)
                        : [...prev, sat.id]
                    );
                  }}
                />
                {sat.name}
              </label>
            </li>
          ))}
        </ul>

        {!search && (
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        )}
      </Sidebar>
      <MainContent>
        <GlobeScene satellites={satellites} />
      </MainContent>
    </AppContainer>
  );
}

export default App;
