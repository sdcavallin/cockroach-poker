import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import {
  CardNumberToString,
  Cards,
  GAME_ROOM_PREFIX,
  GameStatus,
} from './utilities/constants.js';
import playerRoutes from './routes/player.route.js';
import gameRoomRoutes from './routes/gameroom.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { addCardToHand } from './helpers/player.helper.js';
import {
  gameRoomAddCardToHand,
  getGameRoom,
} from './helpers/gameroom.helper.js';
import Player from './models/player.model.js';
import cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';
import { GameRoomService } from './services/gameroom.service.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Create an HTTP server and attach Express
const server = createServer(app);

// SocketIO
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for security
  },
});

// Allows us to parse JSON data in request body
app.use(express.json());

app.use('/api/players', playerRoutes);

app.use('/api/gamerooms', gameRoomRoutes);

app.get('/', (req, res) => {
  const card = Math.floor(Math.random() * 9);
  const message = `I thought it was a ${
    CardNumberToString[Cards.COCKROACH]
  } but it was actually a ${CardNumberToString[card]}!`;
  res.send(message);
  // Example of using addCardToHand()
  //addCardToHand('67ad6bd71b76340c29212842', card);
});

const gameRoomService = new GameRoomService();

// Initialize GameRoomService
(async () => {
  await gameRoomService.initializeGameRoomMap();
})();

// Code to be executed after 1 second. Use only for testing GameRoomService.
// Note: Sockets making requests to the server should not need to wait 1 second for server startup. You can just put them in socket.on(...)
setTimeout(() => {
  // Set to true if you want to run this. Otherwise leave as false.
  const shouldIRunThisFunction = false;
  if (!shouldIRunThisFunction) return;
  // Get GameRoom 123B
  let gameRoom123B = gameRoomService.getGameRoom('123B');
  // Add Scorpion to Adithi's hand
  gameRoom123B.players[1].hand.push(Cards.SCORPION);
  gameRoom123B.players[1].handSize++;
  // Print Adithi
  console.log(gameRoom123B.players[1]);
  // Save GameRoom state (async)
  gameRoomService.saveGameRoom('123B');
}, 1000);

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // connectToRoom: an individual player connects to a gameroom to input their data. Occurs whenever a player socket is connected
  socket.on('connectToRoom', async (roomCode, name) => {
    //const userUUID = getUserUUID(socket.handshake);
    console.log('Testing');
    let userUUID = '12345';

    //emit to socket the UUID so the client can save it on their side.
    socket.emit('setUUID', userUUID);

    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} name ${name} with UUID of ${userUUID} joined room ${
        GAME_ROOM_PREFIX + roomCode
      }`
    );

    const gameRoom = gameRoomService.getGameRoom(roomCode);
    //Checks if the Gameroom already has the player
    let newPlayer = true;
    for (let i = 0; i < gameRoom.players.length; i++) {
      if (gameRoom.players[i].uuid == userUUID) {
        console.log(
          `Updating socketId for ${gameRoom.players[i].nickname}, with socket ${socket.id}`
        );
        gameRoom.players[i].socketId = socket.id;
        newPlayer = false;
        break;
      }
    }
    //If player doesn't exist in the gameroom then it has to create a new player
    if (!newPlayer) {
      console.log(`Adding a new player to ${GAME_ROOM_PREFIX + roomCode}`);
    }

    //NOTE THIS FUNCTION DOESN'T SAVE TO THE DATABASE JUST LOCALLY
    socket.to(GAME_ROOM_PREFIX + roomCode).emit('returnGameRoom', gameRoom);
  });

  // sendCard: sends to an individual Player object (DEPRECATED)
  socket.on('sendCard', async (playerId, card) => {
    console.log(
      `Socket ${socket.id} sent card ${CardNumberToString[card]} to player ${playerId}`
    );

    // Add card to hand
    const player = await addCardToHand(playerId, card);
    socket.emit('receiveHand', player.hand);

    // Send updated gameroom to host
    const gameRoom = await getGameRoom(player.roomCode);
    socket
      .to(GAME_ROOM_PREFIX + player.roomCode)
      .emit('returnGameRoom', gameRoom);
  });

  // gameRoomSendCard: sends to a Player object inside a GameRoom object (DEPRECATED)
  socket.on('gameRoomSendCard', async (roomCode, playerId, card) => {
    console.log(
      `[Room ${roomCode}]: Socket ${socket.id} sent card ${CardNumberToString[card]} to player ${playerId}`
    );

    // Add card to hand
    const player = await gameRoomAddCardToHand(roomCode, playerId, card);
    socket.emit('receiveHand', player.hand);

    // Send updated gameroom to host
    const gameRoom = await getGameRoom(roomCode);
    socket.to(GAME_ROOM_PREFIX + roomCode).emit('returnGameRoom', gameRoom);
  });

  // requestGameRoom: request for GameRoom data from a host
  socket.on('requestGameRoom', async (roomCode) => {
    console.log(`Socket ${socket.id} requested GameRoom info for ${roomCode}`);
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });

  // requestCreateEmptyGameRoom: request to create an empty GameRoom and return it
  socket.on('requestCreateEmptyGameRoom', async () => {
    console.log(`Socket ${socket.id} requested to create an empty GameRoom`);
    const gameRoom = gameRoomService.createEmptyGameRoom();
    socket.emit('returnEmptyGameRoom', gameRoom);
  });

  socket.on('requestStartGame', async (roomCode) => {
    console.log(`Socket ${socket.id} requested to start game ${roomCode}`);
    gameRoomService.startGame(roomCode);
    console.log(`Emitting returnStartGame`);
    socket.emit('returnStartGame', roomCode);
  });

  // requestJoinPlayerToRoom: request to create a new player in a GameRoom that is in SETUP
  socket.on(
    'requestJoinPlayerToRoom',
    async (roomCode, nickname, playerIcon, socketId) => {
      const gameRoom = gameRoomService.getGameRoom(roomCode);
      if (
        !gameRoom ||
        gameRoom.gameStatus != GameStatus.SETUP ||
        gameRoom.numPlayers > 6
      ) {
        socket.emit('returnJoinPlayerToRoom', false, null, null);
      } else {
        const uuid = gameRoomService.addPlayerToGameRoom(
          roomCode,
          nickname,
          playerIcon,
          socketId
        );
        socket.emit('returnJoinPlayerToRoom', true, roomCode, uuid);
        const updatedGameRoom = gameRoomService.getGameRoom(roomCode);
        socket
          .to(GAME_ROOM_PREFIX + roomCode)
          .emit('returnGameRoom', updatedGameRoom);
      }
    }
  );

  // checkJoinCode: checks if the room exists for a roomCode, from player
  socket.on('checkJoinCode', async (roomCode) => {
    console.log(`Socket ${socket.id} requested GameRoom info for ${roomCode}`);
    //roomExists is a boolean
    let roomExists = false;

    const gameRoom = gameRoomService.getGameRoom(roomCode);

    if (gameRoom == undefined) {
      console.log('Game Code is false');
      roomExists = false;
    } else {
      roomExists = true;
    }
    socket.emit('receiveJoinCode', roomExists);
  });

  // joinSocketRoom: socket room join; only used by hosts as of now
  socket.on('joinSocketRoom', async (roomCode) => {
    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} joined room ${GAME_ROOM_PREFIX + roomCode}`
    );
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });

  // selectAvatar: update avatar in memory (no DB call)
  socket.on('selectAvatar', ({ playerId, avatar }) => {
    try {
      const roomCode = gameRoomService.getRoomCodeByPlayerUUID(playerId);
      if (!roomCode) {
        console.warn(`No room found for player UUID: ${playerId}`);
        return;
      }

      const gameRoom = gameRoomService.getGameRoom(roomCode);
      const player = gameRoom.players.find((p) => p.uuid === playerId);

      if (!player) {
        console.warn(
          `Player with UUID ${playerId} not found in GameRoom ${roomCode}`
        );
        return;
      }

      player.playerIcon = avatar;
      console.log(`Avatar updated for ${player.nickname}: ${avatar}`);

      socket.emit('avatarUpdated', { success: true, avatar });
    } catch (error) {
      console.error('Error: Could not update avatar in memory:', error);
      socket.emit('avatarUpdated', {
        success: false,
        message: 'Failed to update avatar',
      });
    }
  });

  // getPlayer: returns a player by roomCode and uuid
  socket.on('getPlayer', (roomCode, uuid) => {
    try {
      // Use gameRoomService to get the game room
      const gameRoom = gameRoomService.getGameRoom(roomCode);

      if (!gameRoom) {
        console.warn(`No game room found for room code: ${roomCode}`);
        socket.emit('returnPlayer', null);
        return;
      }

      // Find the player in the game room
      const player = gameRoom.players.find((p) => p.uuid === uuid);

      if (player) {
        console.log(`Player found: ${player.nickname}`);
        socket.emit('returnPlayer', player);
      } else {
        console.warn(`No player found with UUID: ${uuid} in room: ${roomCode}`);
        socket.emit('returnPlayer', null);
      }
    } catch (error) {
      console.error('Error in getPlayer:', error);
      socket.emit('returnPlayer', null);
    }
  });

  // setSocketId: sets a player by roomCode and uuid's socket to socketId
  socket.on('setSocketId', (roomCode, uuid, socketId) => {
    // Use gameRoomService to check if the gameRoom is real
    console.log(`Socket ID: ${socketId}`);
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    if (!gameRoom) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }

    //calls setPlayerSocketId in gameRoomService
    const player = gameRoomService.setPlayerSocketId(roomCode, uuid, socketId);
    if (!player) {
      console.warn(
        `setPlayerSocketId(): Player with UUID ${uuid} not found in room ${roomCode}.`
      );
    }
  });
  // initPlayerSendCard
  // initPlayerSendCard: starts a turn of players sending a card, only run once and can only run after a resolution is called.
  socket.on('initPlayerSendCard', (senderId, receiverId, card, claim) => {
    console.log(
      `Sender ${senderId}, sent card ${card} and claim ${claim}, to ${receiverId}`
    );
    const roomCode = gameRoomService.getRoomCodeByPlayerUUID(receiverId);
    if (!roomCode) {
      console.warn(`No room found for player UUID: ${receiverId}`);
      return;
    }
    //Uses startConspiracy rather than get gameRoom, also updates turn player
    const gameRoom = gameRoomService.startConspiracy(
      roomCode,
      senderId,
      receiverId,
      card,
      claim
    );
    if (!gameRoom || gameRoom == -1) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }

    io.to(GAME_ROOM_PREFIX + roomCode).emit(
      'turnPlayerUpdated',
      gameRoom.currentAction.turnPlayer
    );
    //That player can either decide to send back 'cardResolution' or 'playerPassCard'
    const conspiracyList = gameRoom.currentAction.conspiracy;
    console.log(
      `SocketId ${
        gameRoomService.getPlayerByUUID(roomCode, receiverId).socketId
      }`
    );
    socket
      .to(gameRoomService.getPlayerByUUID(roomCode, receiverId).socketId)
      .emit('playerReceiveCard', claim, conspiracyList);
  });

  // playerCheckCard: player gets sent back the actual card in the current Conspiracy
  socket.on('playerCheckCard', (receiverId) => {
    const roomCode = gameRoomService.getRoomCodeByPlayerUUID(receiverId);
    if (!roomCode) {
      console.warn(`No room found for player UUID: ${receiverId}`);
      return;
    }
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    if (!gameRoom) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }
    gameRoomService.addConspiracy(roomCode, gameRoom.currentAction.turnPlayer);
    const card = gameRoomService.getConspiracyCard(roomCode);
    const targetPlayer = gameRoomService.getPlayerByUUID(receiverId);

    if (!targetPlayer?.socketId) {
      console.warn(`No socketId for player ${receiverId}`);
      return;
    }

    socket.to(targetPlayer.socketId).emit('checkedCard', card);
  });

  // playerPassCard: after having seen the card the player then makes a claim and sends it to another player
  socket.on('playerPassCard', (receiverId, claim) => {
    const roomCode = gameRoomService.getRoomCodeByPlayerUUID(receiverId);
    if (!roomCode) {
      console.warn(`No room found for player UUID: ${receiverId}`);
      return;
    }
    // sendCards and gets the gameRoom
    const gameRoom = gameRoomService.sendCard(roomCode, receiverId, claim);
    if (!gameRoom) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }

    io.to(GAME_ROOM_PREFIX + roomCode).emit(
      'turnPlayerUpdated',
      gameRoom.currentAction.turnPlayer
    );

    //That player can either decide to send back 'cardResolution' or 'playerPassCard'
    const conspiracyList = gameRoom.currentAction.conspiracy;
    socket
      .to(gameRoomService.getPlayerByUUID(roomCode, receiverId).socketId)
      .emit('playerReceiveCard', claim, conspiracyList);
  });

  // Card Resolution: at the end of a turn a player makes a claim if the player who sent them the card is telling the truth or not
  socket.on('cardResolution', (uuid, receiverClaim) => {
    console.log(
      `cardResolution called for uuid ${uuid}, receiverClaim ${receiverClaim}`
    );
    const roomCode = gameRoomService.getRoomCodeByPlayerUUID(uuid);
    if (!roomCode) {
      console.warn(`No room found for player UUID: ${uuid}`);
      return;
    }
    //ends the turn and figures out the winner and loser and adds a card to their pile
    const index = gameRoomService.resolveTurnEnd(roomCode, uuid, receiverClaim);

    const gameRoom = gameRoomService.getGameRoom(roomCode);
    if (!gameRoom) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }

    //TODO: PURELY FOR PROOF IT WORKS!!!
    console.log(`Loser Pile: ${gameRoom.currentAction.turnPlayer}'s pile: ${gameRoom.players[index].pile}
      Current Status: Card ${gameRoom.currentAction.card}, Claim ${gameRoom.currentAction.claim}, Conspiracy ${gameRoom.currentAction.conspiracy}`);

    io.to(GAME_ROOM_PREFIX + roomCode).emit(
      'turnPlayerUpdated',
      gameRoom.currentAction.turnPlayer
    );

    gameRoomService.checkForGameEnd(roomCode, index);
  });
});
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
