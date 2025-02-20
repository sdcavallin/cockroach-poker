import { io } from "socket.io-client";
import { CardNumberToString, Cards } from './utilities/constants.js';
import playerRoutes from './routes/player.route.js';

const PORT = process.env.PORT || 5000;
const socket = io(`http://localhost:${PORT}`);

// Simulating a player with a userID and a random card
const userID = `MEOW${Math.floor(Math.random() * 100)}`;

const card = CardNumberToString[Math.floor(Math.random() * 9)];

// Connect to the server
socket.on("connect", () => {
  console.log(`Connected to server as ${userID}`);

  // Send a card after connecting
  socket.emit("send card", { userID, card });
  console.log(`Sent card: ${card}`);

  // Listen for card events from the server
  socket.on("display messagec", (data) => {
    console.log(`Received broadcasted card:`, data);
  });
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});