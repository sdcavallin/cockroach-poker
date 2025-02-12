import express from 'express';
import "socket.io";

const app = express();

app.get('/', (req, res) => {
  res.send('Hi');
});

app.listen(5000, () => {
  console.log('Server started at http://localhost:5000');
});
