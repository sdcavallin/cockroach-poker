import express from 'express';
import {
  createGameRoom,
  deleteGameRoom,
  getGameRooms,
  getGameRoom,
  updateGameRoom,
} from '../controllers/gameroom.controller.js';

const router = express.Router();

router.get('/', getGameRooms);

router.get('/:id', getGameRoom);

router.post('/', createGameRoom);

router.put('/:id', updateGameRoom);

router.delete('/:id', deleteGameRoom);

export default router;
