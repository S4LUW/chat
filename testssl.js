const https = require('https');
const fs = require('fs');

// Carregar certificados SSL
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/privkey.pem'), 
    cert: fs.readFileSync('/etc/letsencrypt/live/iadoperito.com.br/fullchain.pem')
};

// Criar servidor HTTPS
const server = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World! Servidor HTTPS funcionando! 🔒');
});

// Iniciar servidor na porta 443
server.listen(443, () => {
    console.log('Servidor HTTPS rodando na porta 443');
});
