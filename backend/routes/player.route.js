import express from 'express';
import {
  createPlayer,
  deletePlayer,
  getPlayers,
  getPlayer,
  updatePlayer,
  getPlayerUUIDByUsername,
} from '../controllers/player.controller.js';

const router = express.Router();

router.get('/uuid/lookup', getPlayerUUIDByUsername);

router.get('/', getPlayers);

router.get('/:id', getPlayer);

router.post('/', createPlayer);

router.put('/:id', updatePlayer);

router.delete('/:id', deletePlayer);

export default router;
