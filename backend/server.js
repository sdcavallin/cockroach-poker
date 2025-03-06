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

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

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
  socket.on('joinRoom', (roomCode) => {
    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} joined room ${GAME_ROOM_PREFIX + roomCode}`
    );
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
