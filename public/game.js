export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    },
  };
  let score1 = 1;
  let vida = 3;

  const observers = [];

  function start() {
    const frequency = 2000;
    setInterval(addFruit, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    console.log(`Notifying ${observers.length} observers`);

    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX =
      'playerX' in command
        ? command.playerX
        : Math.floor(Math.random() * state.screen.width);
    const playerY =
      'playerY' in command
        ? command.playerY
        : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];

    notifyAll({
      type: 'remove-player',
      playerId,
    });
  }

  function addFruit(command) {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 10000000);
    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.screen.width);
    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY,
    });
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];

    notifyAll({
      type: 'remove-fruit',
      fruitId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(palyer) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(palyer) {
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
      ArrowDown(palyer) {
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(palyer) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
    };

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}`);

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);
        score1++;
        if (fruitId <= 5000000) {
          vida--;
          score1--;
        }
        if (fruitId >= 9000000) {
          vida++;
        }
        removeFruit({ fruitId });
      }
    }
    if (typeof document !== 'undefined') {
      //function checkForFruitCollision(playerId)
      const screen2 = document.getElementById('screen2');
      const context2 = screen2.getContext('2d');
      let width2 = 600;
      let height2 = 100;

      // Canvas Background
      context2.fillStyle = 'black';
      context2.fillRect(0, 0, width2, height2);
      context2.fillStyle = 'white';
      context2.font = '32px Courier New';
      context2.fillText('pontos:' + score1, 10, screen2.height / 2 + 40);
      context2.fillText('vidas:' + vida, 10, screen2.height / 2 - 20);

      if (score1 >= 10) {
        console.log(
          'Voce ganhou, parabéns agora volte para sua vida miserável =)'
        );
        context2.fillText('Voce Venceu!', 180, screen2.height / 2 + 40);
        var server = app.listen(process.env.PORT || 3000);

        server.close();
      }
      if (vida <= 0) {
        console.log('Voce Perdeu, agora volte para sua vida miserável =)');
        context2.fillText('Voce Perdeu!', 170, screen2.height / 2 - 20);
        var server = app.listen(process.env.PORT || 3000);

        server.close();
      }
    }
  }
  return {
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start,
  };
}
