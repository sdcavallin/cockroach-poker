import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import {
  CardNumberToString,
  Cards,
  GAME_ROOM_PREFIX,
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

  // gameRoomSendCard: sends to a Player object inside a GameRoom object
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
    const gameRoom = await getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });

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
    socket.emit('recieveJoinCode', roomExists);
  });

  // joinRoom: room join; only used by hosts as of now
  socket.on('joinRoom', async (roomCode) => {
    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} joined room ${GAME_ROOM_PREFIX + roomCode}`
    );
    const gameRoom = await getGameRoom(roomCode);
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
});
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
