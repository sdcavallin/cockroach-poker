import Player from '../models/player.model.js';
import { CardNumberToString } from '../utilities/constants.js';

export const addCardToHand = async (playerId, card) => {
  const player = await Player.findById(playerId); // TODO: Find by UUID instead (?)

  if (!player) {
    console.error('Error: Player not found');
    return;
  }

  console.log(player);

  player.hand.push(card);
  player.handSize++;

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(playerId, player, {
      new: true,
    });
    console.log(
      `Card ${CardNumberToString[card]} added to player ${playerId} hand.`
    );
  } catch (error) {
    console.error(`Error while updating player: ${error.message}`);
  }

  return player.hand;
};
