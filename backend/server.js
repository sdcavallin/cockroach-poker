import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { CardNumberToString, Cards } from './utilities/constants.js';
import playerRoutes from './routes/player.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to parse JSON data in request body

app.use('/api/players', playerRoutes);

app.get('/', (req, res) => {
  res.send(
    `I thought it was a ${
      CardNumberToString[Cards.COCKROACH]
    } but it was actually a ${
      CardNumberToString[Math.floor(Math.random() * 9)]
    }!`
  );
});

app.listen(PORT, () => {
  connectDB();
  console.log('Server started at http://localhost:' + PORT);
});
