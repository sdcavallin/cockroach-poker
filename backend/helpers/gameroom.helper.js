import Player from '../models/player.model.js';
import GameRoom from '../models/gameroom.model.js';
import { CardNumberToString } from '../utilities/constants.js';

export const getGameRoom = async (roomId) => {
  const gameRoom = await GameRoom.findOne({ roomCode: roomId });

  if (!gameRoom) {
    console.error('Error: getGameRoom: GameRoom not found');
    return;
  }

  return gameRoom;
};

// Adds card to a player's hand inside a GameRoom.
export const gameRoomAddCardToHand = async (roomId, playerId, card) => {
  const gameRoom = await GameRoom.findOne({ roomCode: roomId });

  if (!gameRoom) {
    console.error('Error: gameRoomAddCardToHand: GameRoom not found');
    return;
  }

  const index = gameRoom.players.findIndex((player) => player.uuid == playerId);

  gameRoom.players[index].hand.push(card);
  gameRoom.players[index].handSize++;

  try {
    await gameRoom.save();
    console.log(
      `[Room ${roomId}]: Card ${CardNumberToString[card]} added to player ${playerId} hand.`
    );
  } catch (error) {
    console.error(`Error while updating GameRoom: ${error.message}`);
  }

  return gameRoom.players[index];
};
