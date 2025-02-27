import mongoose from 'mongoose';

/*
* Player Schema *
Represents a player in an active game and their cards.
*/
export const PlayerSchema = new mongoose.Schema({
  // uuid: Unique id to identify players. Will be stored on the client (probably as a cookie).
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  // nickname: Player's chosen nickname.
  nickname: {
    type: String,
    required: true,
  },
  // playerIcon: Player icon.
  playerIcon: {
    type: String,
  },
  // hand: Array of numbers representing cards in hand.
  hand: {
    type: [Number],
    required: true,
  },
  // handSize: Hand size.
  handSize: {
    type: Number,
    required: true,
  },
  // pile: Array of numbers representing cards face-up in front of the player.
  pile: {
    type: [Number],
    required: true,
  },
  // pileSize: Pile size.
  pileSize: {
    type: Number,
    required: true,
  },
  // roomCode: Room this player is in.
  // roomCode: {
  //   type: String,
  //   required: true,
  // },
  socketId: {
    type: String,
  },
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
