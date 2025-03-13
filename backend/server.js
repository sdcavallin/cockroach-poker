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

dotenv.config();

const app = express();
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

const getUserUUID = (req) => {
  const cookies = cookie.parse(req.headers.cookie || ''); // Parse cookies
  return cookies.userUUID || uuidv4();
};

const gameRoomService = new GameRoomService();

// Initialize GameRoomService
(async () => {
  await gameRoomService.initializeGameRoomMap();
})();

// Code to be executed after 1 second. Use only for testing GameRoomService.
setTimeout(() => {
  // Set to true if you want to run this. Otherwise leave as false to not do a bunch of arbitrary stuff every server startup.
  const shouldIRunThisFunction = false;
  if (!shouldIRunThisFunction) return;
  // Get GameRoom 123B
  let gameRoom123B = gameRoomService.getGameRoom('123B');
  // Add Scorpion to Adithi's hand
  gameRoom123B.players[1].hand.push(Cards.SCORPION);
  // Print Adithi
  console.log(gameRoom123B.players[1]);
  // Save GameRoom state (async)
  gameRoomService.saveGameRoom('123B');
}, 1000);
// Sockets making requests to the server should not need to wait 1 second for server startup. You can just put them in socket.on(...)

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  // connectToRoom: an individual player connects to a gameroom to input their data. Occurs whenever a player socket is connected
  socket.on('connectToRoom', async (roomCode, name) => {
    //const userUUID = getUserUUID(socket.handshake);
    let userUUID = '12345';
    //emit to socket the UUID so the client can save it on their side.

    socket.emit('setUUID', userUUID);

    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} name ${name} with UUID of ${userUUID} joined room ${
        GAME_ROOM_PREFIX + roomCode
      }`
    );

    const gameRoom = getGameRoom(roomCode);
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

  // sendCard: sends to an individual Player object (deprecated)
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

  // joinRoom: room join; only used by hosts as of now
  socket.on('joinRoom', async (roomCode) => {
    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} joined room ${GAME_ROOM_PREFIX + roomCode}`
    );
    const gameRoom = await getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
