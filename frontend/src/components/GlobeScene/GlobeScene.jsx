import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import SunCalc from "suncalc";
import "./GlobeScene.css";

export const GlobeScene = ({ satellites = [] }) => {
  const globeRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("Satellites recebidos no globo:", satellites);
  }, [satellites]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const isMobile = window.innerWidth <= 768;
      globeRef.current.pointOfView(
        {
          lat: 0,
          lng: 0,
          altitude: isMobile ? 6.5 : 2,
        },
        1000
      );

      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);
  const satMarkers = satellites
    .filter((sat) => sat.latitude != null && sat.longitude != null)
    .map((sat) => {
      return {
        lat: sat.latitude,
        lng: sat.longitude,
        name: sat.name,
        id: sat.id,
        altitude: sat.altitude,
        color: "#00ffff",
      };
    });

  return (
    <div ref={containerRef} className="globe-container">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        animateIn={true}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere={true}
        atmosphereColor="#74a8ff"
        atmosphereAltitude={0.15}
        pointAltitude={0.05}
        pointRadius={0.3}
        pointsData={satMarkers}
        pointColor="color"
        pointLabel={(d) =>
          `<b>${d.name}</b><br/>Altitude: ${d.altitude?.toFixed(2)} km`
        }
        onGlobeReady={() => {
          const scene = globeRef.current.scene();
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(5, 3, 5);
          scene.add(directionalLight);
        }}
      />
    </div>
  );
};
