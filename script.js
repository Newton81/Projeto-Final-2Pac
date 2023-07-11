var socket = io();

// document.querySelector(".options").classList.add("hide")
// document.querySelector(".game").classList.add("show")

document
  .querySelector('#txtNewMessageChat')
  .addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
      sendMessageChat();
    }
  });

let roomId = '';
let userId = '';

//let roomsMap = new Map()

function createRoom() {
  let namePlayer = document.getElementById('txtNamePlayer').value;
  if (namePlayer == '') {
    alert('Preencha o nome!');
    return false;
  }

  var codeRoomCreate = document.getElementById('txtRoomIdCreated').value;

  if (codeRoomCreate == '') {
    alert('Código da sala é obrigatório!');
    return false;
  }

  let hashRoomCreated = document.getElementById('txtRoomIdCreated').value;
  socket.emit('create-room', hashRoomCreated, namePlayer);
  roomId = hashRoomCreated;
  userId = namePlayer;

  document.querySelector('#codeRoom').innerHTML = roomId;
  document.querySelector('.options').classList.add('hide');
  document.querySelector('.game').classList.add('show');
}

function enterRoom() {
  let namePlayer = document.getElementById('txtNamePlayer').value;
  if (namePlayer == '') {
    alert('Preencha o nome!');
    return false;
  }

  var codeRoomJoin = document.getElementById('txtRoomIdEnter').value;

  if (codeRoomJoin == '') {
    alert('Código da sala é obrigatório!');
    return false;
  }

  let hashRoomEntered = document.getElementById('txtRoomIdEnter').value;
  socket.emit('join-room', hashRoomEntered, namePlayer);
  roomId = hashRoomEntered;
  userId = namePlayer;

  document.querySelector('#codeRoom').innerHTML = roomId;
  document.querySelector('.options').classList.add('hide');
  document.querySelector('.game').classList.add('show');
}

socket.on('receive-chat', function (msg, user) {
  createChatMessage(msg, user);
});

socket.on('receive-global-chat', function (msg, user) {
  createGlobalChatMessage(msg, user);
});

socket.on('startGame', (refereeId) => {
  //console.log('Referee is', refereeId);  //não haverá referee
  console.log('O jogo vai começar');

  //isReferee = socket.id === refereeId;
  //startGame();
});

/*socket.on('update-map', function(roomId, userCountPlus){
    let previousPlayerCount = roomsMap.get(roomId)
    roomsMap.set(roomId, previousPlayerCount + userCountPlus)
    console.log("(update-map) roomsMap size: " + roomsMap.size)
})*/

function createChatMessage(msg, user) {
  let tmpli = '';
  if (msg == ' entrou na sala') {
    tmpli = '<li><b>' + user + '</b> ' + msg + '</li>';
  } else {
    tmpli = '<li><b>' + user + '</b>: ' + msg + '</li>';
  }

  document.getElementById('messages').innerHTML += tmpli;
}

function createGlobalChatMessage(msg, user) {
  let tmpli = '';
  if (msg == ' entrou na sala de espera') {
    tmpli = '<li><b>' + user + '</b> ' + msg + '</li>';
  } else {
    tmpli = '<li><b>' + user + '</b>: ' + msg + '</li>';
  }

  document.getElementById('global-messages').innerHTML += tmpli;
}

function sendMessageChat() {
  let msg = document.querySelector('#txtNewMessageChat').value;
  if (msg.length < 0) return false;
  createChatMessage(msg, userId);
  socket.emit('send-message-chat', roomId, userId, msg);
  document.querySelector('#txtNewMessageChat').value = '';
}

function sendMessageGlobalChat() {
  userId = document.getElementById('txtNamePlayer').value;
  if (userId == '') {
    alert('Preencha o nome!');
    return false;
  }
  let msg = document.querySelector('#txtNewMessageGlobalChat').value;
  if (msg.length < 0) return false;
  socket.emit('send-message-global-chat', userId, msg);
  document.querySelector('#txtNewMessageGlobalChat').value = '';
}

function disconnect() {
  console.log('Um jogador saiu da sala');

  roomId = document.getElementById('txtRoomIdEnter').value;
  if (roomId == '') {
    roomId = document.getElementById('txtRoomIdCreated').value;
  }
  socket.emit('disconnect-room', roomId);

  document.querySelector('.options').classList.remove('hide');
  document.querySelector('.game').classList.remove('show');

  if (document.getElementById('txtRoomIdCreated').value != '') {
    document.getElementById('txtRoomIdCreated').value = '';
  }
  if (document.getElementById('txtRoomIdEnter').value != '') {
    document.getElementById('txtRoomIdEnter').value = '';
  }
}
function ready() {
  console.log('Um jogador está pronto');
  //if (typeof document !== 'undefined') {
  // <iframe src="./public/index.html" height="500"></iframe>;
  //}
  roomId = document.getElementById('txtRoomIdEnter').value;
  if (roomId == '') {
    roomId = document.getElementById('txtRoomIdCreated').value;
  }
  console.log('typeof roomId: ' + typeof roomId);
  console.log('o nome da sala é ' + roomId);

  socket.emit('ready', roomId);
}
