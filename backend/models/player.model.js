import mongoose from 'mongoose';

/*
Player Schema
*/
const playerSchema = new mongoose.Schema({
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
playerSchema.index({ uuid: 1 });

const Player = mongoose.model('Player', playerSchema);

export default Player;
