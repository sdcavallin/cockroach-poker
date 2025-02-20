import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { CardNumberToString, Cards } from './utilities/constants.js';
import playerRoutes from './routes/player.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { addCardToHand } from './helpers/player.helper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server and attach Express
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for security
    methods: ['GET', 'POST'],
  },
});

app.use(express.json()); // allows us to parse JSON data in request body

app.use('/api/players', playerRoutes);

app.get('/', (req, res) => {
  // TODO: '/' should only return basic message or status for testing purposes until deployed to prod
  res.sendFile(path.resolve('backend/index.test.html'));
  //res.send('Hi');
});

app.get('/message', (req, res) => {
  const card = Math.floor(Math.random() * 9);
  const message = `I thought it was a ${
    CardNumberToString[Cards.COCKROACH]
  } but it was actually a ${CardNumberToString[card]}!`;
  res.send(message);
  // Example of using addCardToHand()
  //addCardToHand('67ad6bd71b76340c29212842', card);
});

// Websocket connection
io.on('connection', (socket) => {
  // ...
  console.log('A user connected');

  socket.on('send card', ({ userID, card }) => {
    console.log(`Card sent by user ${userID}: ${card}`);

    const message = `Player: ${userID} sent ${card}`;

    io.emit('display message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
