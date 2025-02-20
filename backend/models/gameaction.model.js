import mongoose from 'mongoose';

/*
* GameAction Schema *
Represents an action taken by a player. 
A GameAction is not standalone; they are used only in GameRoom.

* Notes *
References prevPlayer and turnPlayer by ObjectId to avoid redundancy.
TODO: Possibly reference them by UUID or embedded instead.
*/
export const GameActionSchema = new mongoose.Schema({
  // prevPlayer: The player who handed the card to the current player. If the turn is just starting, prevPlayer == turnPlayer.
  prevPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  // turnPlayer: The player whose turn it is.
  turnPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  // conspiracy: The list of players who have already seen the card.
  conspiracy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Player',
    required: true,
  },
  // card: The actual card being passed around.
  card: {
    type: Number,
    required: true,
  },
  // claim: The claim prevPlayer made about the card.
  claim: {
    type: Number,
    required: true,
  },
});

const GameAction = mongoose.model('GameAction', GameActionSchema);

export default GameAction;
