import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom drone icon
const createDroneIcon = (bearing) => {
  // Adjust rotation to align with SVG coordinate system
  // Subtract 90° to align with north, and negate for clockwise rotation
  const rotation = -(bearing - 90);
  
  return new L.DivIcon({
    className: 'drone-icon',
    html: `
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg)">
        <!-- Dart shape with concave back -->
        <path d="M32 4L20 32C20 32 24 44 32 44C40 44 44 32 44 32L32 4Z" fill="#FF4444"/>
        <!-- Center dot -->
        <circle cx="32" cy="32" r="6" fill="#FFFFFF"/>
      </svg>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });
};

// Component to handle WebSocket connection and drone updates
function DroneMarkers() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8080');

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
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[47.5767, -122.3869]} // 47°34'36"N 122°23'13"W
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={1}
        />
        <DroneMarkers />
      </MapContainer>
    </div>
  );
} 