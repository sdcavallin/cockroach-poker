import mongoose from 'mongoose';
import { PlayerSchema } from './player.model';

/*
GameRoom Schema
'gameStatus' is a number that refers to the GameStatus constant
'players' is an array of Players following the Player schema
'currentAction' follows the Action schema
*/
const GameRoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    numPlayers: {
      type: Number,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    gameStatus: {
      type: Number,
      required: true,
    },
    players: {
      type: [PlayerSchema],
      require: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Create an index on roomCode for fast lookups
playerSchema.index({ roomCode: 1 });

const GameRoom = mongoose.model('GameRoom', GameRoomSchema);

export default GameRoom;
