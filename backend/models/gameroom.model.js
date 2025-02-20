import mongoose from 'mongoose';
import { PlayerSchema } from './player.model';
import GameAction, { GameActionSchema } from './gameaction.model';

/*
* GameRoom Schema *
Represents the entire state of a game.
*/
const GameRoomSchema = new mongoose.Schema(
  {
    // roomCode: Room code used by players to join the room.
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    // numPlayers: Current number of players in lobby.
    numPlayers: {
      type: Number,
      required: true,
    },
    // maxPlayers: Maximum number of players in lobby.
    maxPlayers: {
      type: Number,
      required: true,
    },
    // gameStatus: Number representing game status. See GameStatus constant.
    gameStatus: {
      type: Number,
      required: true,
    },
    // players: Array of players currently in the game. See PlayerSchema.
    // TODO: Possibly represent this as reference by ID.
    players: {
      type: [PlayerSchema],
      require: true,
    },
    // currentAction: Current action being taken in the game. See GameActionSchema.
    currentAction: {
      type: [GameActionSchema],
      require: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const GameRoom = mongoose.model('GameRoom', GameRoomSchema);

export default GameRoom;
