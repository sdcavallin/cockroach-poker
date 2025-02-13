import mongoose from 'mongoose';

/*
Player Schema
'hand' and 'pile' are number arrays that refer to the Cards constant.
*/
export const PlayerSchema = new mongoose.Schema({
  // uuid: Unique id to identify players.
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
});

// Create an index on uuid for fast lookups
PlayerSchema.index({ uuid: 1 });

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
