import mongoose from 'mongoose';
import Player from '../models/player.model.js';

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({});
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    console.error(`Error in fetching players: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching players',
    });
  }
};

export const createPlayer = async (req, res) => {
  const player = req.body; // user request body

  // TODO: Add validation (may not be necessary with MongoDB automatic validation on .save())
  if (!player.uuid) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide all Player fields' });
  }

  const newPlayer = new Player(player);

  try {
    await newPlayer.save();
    res.status(201).json({ success: true, data: newPlayer });
  } catch (error) {
    console.error(`Error while creating player: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: 'Server error while creating player' });
  }
};

export const updatePlayer = async (req, res) => {
  const { id } = req.params;

  const reqPlayer = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Error while updating player: Invalid Player ID`);
    return res
      .status(404)
      .json({ success: false, message: 'Error: Invalid Player ID' });
  }

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(id, reqPlayer, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    console.error(`Error while updating player: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: 'Server error while updating player' });
  }
};

export const deletePlayer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Error while updating player: Invalid Player ID`);
    return res
      .status(404)
      .json({ success: false, message: 'Error: Invalid Player ID' });
  }

  try {
    await Player.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Player deleted' });
  } catch (error) {
    console.error(`Error while deleting player: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: 'Server error while deleting player' });
  }
};
