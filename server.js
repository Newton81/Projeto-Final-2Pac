import express from 'express';
import createGame from './public/game';
import socket from 'socket.io';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const sockets = socket(http);

app.use(express.static(__dirname + '/'));

app.use(express.static('static'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + 'index.html');
});
//app.use(express.static(__dirname + '/'));
app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
  sockets.emit(command.type, command);
});

sockets.on('connection', (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected: ${playerId}`);

  game.addPlayer({ playerId: playerId });
  console.log(game.state);
  socket.emit('setup', game.state);

  socket.on('disconnect', () => {
    console.log(`> Player disconnected: ${playerId}`);
    game.removePlayer({ playerId: playerId });
  });

  socket.on('move-player', (command) => {
    command.playerId = playerId;
    command.type = 'move-player';

    game.movePlayer(command);
  });
});

//
let roomsMap = new Map();
//

//
let readyPlayerCount = 0;
//

io.on('connection', function (socket) {
  let room;

  socket.on('create-room', (roomId, userId) => {
    socket.join(roomId);
    //
    roomsMap.set(roomId, 1);
    console.log(
      '(server) ' + roomId + ' tem: ' + roomsMap.get(roomId) + ' jogadores'
    );
    //
  });

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('receive-chat', ' entrou na sala', userId);
    //
    let previousPlayerCount = roomsMap.get(roomId);
    roomsMap.set(roomId, previousPlayerCount + 1);
    console.log(
      '(server) ' + roomId + ' tem: ' + roomsMap.get(roomId) + ' jogadores'
    );
    //
  });

  socket.on('ready', (roomId) => {
    //room = 'room' + Math.floor(readyPlayerCount / 2); //os jogadores não vão para outra sala
    //socket.join(room);                                //os jogadores não vão para outra sala

    console.log('Player ready on room: ' + roomId);

    readyPlayerCount++;
    console.log('Existe(m) ' + readyPlayerCount + ' jogadores preparados');

    if (readyPlayerCount % 2 === 0) {
      socket.in(roomId).emit('startGame');
    }
    socket.on('startGame', (refereeId) => {
      //console.log('Referee is', refereeId);  //não haverá referee
      console.log('O jogo vai começar');

      //isReferee = socket.id === refereeId;
      //startGame();
    });
  });

  socket.on('disconnect-room', (roomId, userId) => {
    socket.to(roomId).emit('receive-chat', ' saiu da sala', userId);
    //socket.to(roomId); metodo para o jogador sair da sala e voltar para a página principal

    /*
    let previousPlayerCount = roomsMap.get(roomId);
    roomsMap.set(roomId, previousPlayerCount - 1);

    console.log("(server) " + roomId + " tem: " + roomsMap.get(roomId) + " jogadores");
    

    if (roomsMap.get(roomId) == 0){
      //significa que não ha mais jogadores na sala, portanto a sala deve ser excluída
      console.log ("A sala " + roomId + " será deletada pois não há mais jogadores nela")
      roomsMap.delete(roomId);
    }

    //*/
  });

  socket.on('send-message-chat', (roomId, userId, msg) => {
    socket.to(roomId).emit('receive-chat', msg, userId);
  });

  socket.on('send-message-global-chat', (userId, msg) => {
    io.emit('receive-global-chat', msg, userId);
  });
});

http.listen(3000, function () {
  console.log('Servidor rodando em: http://localhost:3000');
});
