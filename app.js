/* const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// Carregar certificados SSL
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/privkey.pem'),
  port: 3001
}); 

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

*/

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// Carregar certificados SSL
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/fullchain.pem')
};

// Criar servidor HTTPS na porta 3001
const server = https.createServer(options);
server.listen(3001, () => {
    console.log('Servidor HTTPS rodando na porta 3001');
});

// Criar WebSocket Server (WSS) sobre HTTPS
const wss = new WebSocket.Server({ server });

// Armazenar clientes conectados
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    broadcastOnlineUsers();

    ws.on('message', (message) => {
        // Enviar mensagem para todos os clientes conectados
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('online', (message) => {
        // Enviar mensagem de status online para todos os clientes
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        // Remover cliente da lista quando desconectar
        clients.delete(ws);
        broadcastOnlineUsers();
    });
});

function broadcastOnlineUsers() {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ online: clients.size }));
        }
    });
}

