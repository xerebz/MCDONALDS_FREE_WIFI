import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DroneMap.css'
import L from 'leaflet';

const createDroneIcon = (bearing) => {
  // Adjust rotation to align with SVG coordinate system
  const rotation = -(bearing - 90);

  return new L.DivIcon({
    className: 'drone-icon',
    html: `
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg)">
        <g>
          <!-- Left half of dart -->
          <path
            d="M4,60 L32,45 L32,4 Z"
            fill="#2c3e50"
            stroke="none"
          />
          <!-- Right half of dart (darker for 3D effect) -->
          <path
            d="M32,4 L32,45 L60,60 Z"
            fill="#1a252f"
            stroke="none"
          />
          <!-- Single consistent border around the entire shape -->
          <path
            d="M4,60 L32,45 L60,60 L32,4 Z"
            fill="none"
            stroke="#aaaaaa"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });
};

function DroneMarkers() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onmessage = (event) => {
      const droneData = JSON.parse(event.data);
      setDrones(droneData);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return drones.map((drone) => (
    <Marker
      key={drone.id}
      position={[drone.lat, drone.lng]}
      icon={createDroneIcon(drone.bearing)}
    />
  ));
}

export default function DroneMap() {
  return (
    <MapContainer
      center={[47.5767, -122.3869]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <DroneMarkers />
    </MapContainer>
  );
}