import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { CardNumberToString, Cards } from './utilities/constants.js';
import playerRoutes from './routes/player.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { addCardToHand } from './helpers/player.helper.js';

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
  console.log(socket.id);
  socket.on('sendCard', async (playerId, card) => {
    console.log(`Socket ${socket.id} sent card ${card} to player ${playerId}`);
    const hand = await addCardToHand(playerId, card);
    socket.emit('receiveHand', hand);
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
