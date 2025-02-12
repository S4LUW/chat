const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3001 });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  broadcastOnlineUsers();

  ws.on('message', (message) => {
    // Broadcast the received message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('online', (message) => {
    // Broadcast the received message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    // Remove the client from the set on disconnect
    clients.delete(ws);

    // Send the updated number of online users to all clients
    broadcastOnlineUsers();
  });
});

function broadcastOnlineUsers() {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({online: clients.size}));
    }
  });
}
