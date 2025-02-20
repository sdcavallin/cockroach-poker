import mongoose from 'mongoose';
import GameRoom from '../models/gameroom.model.js';

export const getGameRooms = async (req, res) => {
  try {
    const gameRooms = await GameRoom.find({});
    res.status(200).json({ success: true, data: gameRooms });
  } catch (error) {
    console.error(`Error in fetching gameRooms: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gameRooms',
    });
  }
};

export const createGameRoom = async (req, res) => {
  const gameRoom = req.body; // user request body

  // TODO: Add validation (may not be necessary with MongoDB automatic validation on .save())
  if (!gameRoom.roomCode) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide all GameRoom fields' });
  }

  const newGameRoom = new GameRoom(gameRoom);

  try {
    await newGameRoom.save();
    res.status(201).json({ success: true, data: newGameRoom });
  } catch (error) {
    console.error(`Error while creating gameRoom: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gameRoom',
    });
  }
};

export const updateGameRoom = async (req, res) => {
  const { id } = req.params;

  const reqGameRoom = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Error while updating gameRoom: Invalid GameRoom ID`);
    return res
      .status(404)
      .json({ success: false, message: 'Error: Invalid GameRoom ID' });
  }

  try {
    const updatedGameRoom = await GameRoom.findByIdAndUpdate(id, reqGameRoom, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedGameRoom });
  } catch (error) {
    console.error(`Error while updating gameRoom: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gameRoom',
    });
  }
};

export const deleteGameRoom = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Error while updating gameRoom: Invalid GameRoom ID`);
    return res
      .status(404)
      .json({ success: false, message: 'Error: Invalid GameRoom ID' });
  }

  try {
    await GameRoom.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'GameRoom deleted' });
  } catch (error) {
    console.error(`Error while deleting gameRoom: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gameRoom',
    });
  }
};
