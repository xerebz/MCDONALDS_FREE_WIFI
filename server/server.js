const WebSocket = require('ws');

// Center coordinates (47°34'36"N 122°23'13"W)
const CENTER_LAT = 47.5767;
const CENTER_LNG = -122.3869;

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8081 });

let simulationInterval;

// Simulate drone movement
function simulateDroneMovement() {
  let angle = 0;

  // Update drone position every 500ms (2Hz)
  simulationInterval = setInterval(() => {
    const radius = 0.01;
    const lat = CENTER_LAT + radius * Math.sin(angle);
    const lng = CENTER_LNG + radius * Math.cos(angle);
    const bearing = (angle * 180 / Math.PI + 90) % 360;
    
    // Create drone data
    const droneData = [{
      id: 'drone1',
      lat,
      lng,
      bearing
    }];

    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(droneData));
      }
    });

    angle += 0.05;
  }, 500); // Changed to 500ms for 2Hz updates
}

// Start simulation immediately
simulateDroneMovement();

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080'); 