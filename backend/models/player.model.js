import mongoose from 'mongoose';

/*
Player Schema
'hand' and 'pile' are number arrays that refer to the Cards constant
*/
export const PlayerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  playerIcon: {
    type: String,
  },
  hand: {
    type: [Number],
    required: true,
  },
  handSize: {
    type: Number,
    required: true,
  },
  pile: {
    type: [Number],
    required: true,
  },
  pileSize: {
    type: Number,
    required: true,
  },
});

// Create an index on uuid for fast lookups
PlayerSchema.index({ uuid: 1 });

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
