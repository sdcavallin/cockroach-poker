import GameRoom from '../models/gameroom.model.js';
import { GameStatus } from '../utilities/constants.js';

// Manages GameRoom instances for you.
export class GameRoomService {
  // Maps roomCode => gameRoom
  gameRoomMap = new Map();

  // Initializes gameRoomMap from the database.
  async initializeGameRoomMap() {
    // Get all active gameRooms (such that status is not ENDED)
    const gameRooms = await GameRoom.find({
      gameStatus: { $ne: GameStatus.ENDED },
    });

    for (const gameRoom of gameRooms) {
      this.gameRoomMap.set(gameRoom.roomCode, gameRoom);
    }

    //console.log('gameRoomMap initialized:', this.gameRoomMap);
  }

  // Get GameRoom by roomCode.
  // This returns by reference, meaning if you modify
  // the gameRoom elsewhere, it will modify it in gameRoomMap.
  getGameRoom(roomCode) {
    return this.gameRoomMap.get(roomCode);
  }

  // Returns a player by UUID.
  getPlayerByUUID(roomCode, uuid) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) return null;
    for (let player of gameRoom.players) {
      if (player.uuid == uuid) return player;
    }
    return null;
  }

  // Update GameRoom contents.
  updateGameRoom(roomCode, gameRoom) {
    this.gameRoomMap.set(roomCode, gameRoom);
  }

  // Update GameRoom contents and save to database (expensive).
  async updateGameRoomAndSave(roomCode, gameRoom) {
    this.gameRoomMap.set(roomCode, gameRoom);
    gameRoom.save();
  }

  // Create an empty GameRoom.
  // Returns the generated roomCode.
  async createEmptyGameRoom() {
    const roomCode = this.generateValidRoomCode();

    const gameRoomBody = {
      roomCode: roomCode,
      numPlayers: 0,
      gameStatus: GameStatus.SETUP,
      players: [],
      currentAction: null,
    };

    const gameRoom = new GameRoom(gameRoomBody);

    this.gameRoomMap.set(roomCode, gameRoom);

    gameRoom.save();

    return roomCode;
  }

  // Create an empty GameRoom with a specific code and save to database.
  async createEmptyGameRoom(roomCode) {
    if (this.gameRoomMap.has(roomCode)) {
      throw new Error(
        `createEmptyGameRoom(): An active room with code ${roomCode} already exists.`
      );
      return roomCode;
    }

    const gameRoomBody = {
      roomCode: roomCode,
      numPlayers: 0,
      gameStatus: GameStatus.SETUP,
      players: [],
      currentAction: null,
    };

    const gameRoom = new GameRoom(gameRoomBody);

    this.gameRoomMap.set(roomCode, gameRoom);

    gameRoom.save();

    return roomCode;
  }

  // Save GameRoom contents to database.
  async saveGameRoom(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    gameRoom.save();
  }

  // Saves all GameRooms to the database. (EXPENSIVE, likely will not be used)
  async saveAll() {
    this.gameRoomMap.forEach((roomCode, gameRoom) => {
      gameRoom.save();
    });
  }

  // Used to end a game.
  // Will update the game status and remove it from the map.
  async terminateGameRoom(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);

    gameRoom.gameStatus = GameStatus.ENDED;

    gameRoom.save();

    this.gameRoomMap.delete(roomCode);
  }

  // Generates a roomCode that is not used by any other room.
  generateValidRoomCode() {
    const characters = 'ABDEFGHIJKLMNPQRSTUVWXY123456789';
    do {
      let roomCode = '';
      for (let i = 0; i < 4; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * 32));
      }
    } while (this.gameRoomMap.has(roomCode));

    return roomCode;
  }
}
