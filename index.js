const http = require('http');
const io = require('socket.io');

const apiServer = require('./api');
const httpServer = http.createServer(apiServer);
const socketServer = io(httpServer);

const sockets = require('./server');

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('static'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

const PORT = 3010;
httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);

//sockets.listen(socketServer);
