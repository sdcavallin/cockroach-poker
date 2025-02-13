import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { CardNumberToString, Cards } from './utilities/constants.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hi ' + CardNumberToString[Cards.COCKROACH]);
});

app.listen(5000, () => {
  connectDB();
  console.log('Server started at http://localhost:5000');
});
