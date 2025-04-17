import { useEffect, useState } from "react";
import { GlobeScene } from "./components/GlobeScene/GlobeScene";
import { fetchSatellites, fetchSatellitesList } from "./services/api";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  margin-left: 280px;
  flex: 1;
  height: 100vh;
  width: calc(100vw - 280px);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100vw;
  }
`;

function App() {
  const [satelliteList, setSatelliteList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const satellitesPerPage = 10;

  const filteredSatellites = satelliteList.filter((sat) =>
    sat.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedSatellites = search
    ? filteredSatellites.slice(0, satellitesPerPage)
    : satelliteList.slice(
        (currentPage - 1) * satellitesPerPage,
        currentPage * satellitesPerPage
      );

  const totalPages = search
    ? 1
    : Math.ceil(satelliteList.length / satellitesPerPage);

  useEffect(() => {
    const loadList = async () => {
      const list = await fetchSatellitesList();
      setSatelliteList(list);
    };
    loadList();
  }, []);

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

      const satellitesWithCoords = merged.filter(
        (sat) => sat.latitude != null && sat.longitude != null
      );

      const satellitesWithoutCoords = merged.filter(
        (sat) => sat.latitude == null || sat.longitude == null
      );

      satellitesWithoutCoords.forEach((sat) => {
        toast.warn(
          <span>
            Localização do satélite <strong>"{sat.name}"</strong> está oculta
            por restrição ou ausência de dados.
          </span>,
          {
            position: "bottom-right",
            autoClose: 4000,
            theme: "dark",
          }
        );
      });

      setSatellites(satellitesWithCoords);
    };

    loadSelectedSatellites();
  }, [selectedIds]);

  return (
    <AppContainer>
      <button
        className={`hamburger-btn sleek ${isSidebarOpen ? "hidden" : ""}`}
        onClick={() => setSidebarOpen(true)}
      >
        <span className="line line-top" />
        <span className="line line-middle" />
        <span className="line line-bottom" />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)}>
        <input
          type="text"
          placeholder="Buscar satélite..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="sidebar-search"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#ccc",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <ul>
          {paginatedSatellites.map((sat) => (
            <li key={sat.id}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
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
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </Sidebar>

      <MainContent>
        <GlobeScene satellites={satellites} />
      </MainContent>

      <ToastContainer />
    </AppContainer>
  );
}

export default App;
