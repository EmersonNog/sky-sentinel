import { Rotate3D, Target } from "lucide-react";
import "./GlobeControls.css";

export const GlobeControls = ({ globeRef }) => {
  const toggleRotation = () => {
    const controls = globeRef.current.controls();
    controls.autoRotate = !controls.autoRotate;
  };

  const centerGlobe = () => {
    globeRef.current.pointOfView({ lat: 0, lng: -50, altitude: 2 }, 1000);
  };

  return (
    <div className="globe-controls">
      <button
        className="globe-button rotation-toggle"
        onClick={toggleRotation}
        title="Ativar/Desativar rotação orbital"
      >
        <Rotate3D size={16} />
        <span className="label">Rotação Orbital</span>
      </button>

      <button
        className="globe-button reset-view"
        onClick={centerGlobe}
        title="Centralizar globo"
      >
        <Target size={16} />
        <span className="label">Centralizar Globo</span>
      </button>
    </div>
  );
};
