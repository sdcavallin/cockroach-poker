import GameRoom from '../models/gameroom.model.js';
import Player from '../models/player.model.js';
import { CardNumberToString, GameStatus } from '../utilities/constants.js';
import { v4 as uuidv4 } from 'uuid';

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
  // Returns the generated room.
  createEmptyGameRoom() {
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

    return gameRoom;
  }

  // Create an empty GameRoom with a specific code.
  createEmptyGameRoomWithCode(roomCode) {
    if (this.gameRoomMap.has(roomCode)) {
      throw new Error(
        `createEmptyGameRoom(): An active room with code ${roomCode} already exists.`
      );
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

    return gameRoom;
  }

  // Add new player to GameRoom. Returns assigned UUID.
  addPlayerToGameRoom(roomCode, nickname, playerIcon, socketId) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`addPlayerToGameRoom(): GameRoom ${roomCode} not found.`);
    }

    const uuid = uuidv4();
    const playerBody = {
      uuid: uuid,
      nickname: nickname,
      playerIcon: playerIcon,
      hand: [],
      handSize: 0,
      pile: [],
      pileSize: 0,
      // TODO: Update this socketId to the /DummyPlay one, not the /DummyJoinSetup
      socketId: 'WRONG-' + socketId,
    };

    const player = new Player(playerBody);

    gameRoom.players.push(player);
    gameRoom.numPlayers++;

    return uuid;
  }

  // Start game.
  startGame(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`startGame(): GameRoom ${roomCode} not found.`);
    }

    // Set game status to ONGOING
    gameRoom.gameStatus = GameStatus.ONGOING;

    // Create the deck (8 of each card type 1–8)
    const deck = [];
    const numCards = 64;
    for (let cardType = 1; cardType <= 8; cardType++) {
      for (let i = 0; i < 8; i++) {
        deck.push(cardType);
      }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal cards evenly (just divide all cards among players, its fin eif theres hella cards)
    const numPlayers = gameRoom.players.length;
    const cardsPerPlayer = Math.floor(numCards / numPlayers);

    gameRoom.players.forEach((player, index) => {
      const start = index * cardsPerPlayer;
      const end = start + cardsPerPlayer;
      player.hand = deck.slice(start, end);
      player.handSize = player.hand.length;
    });

    // Debug prints
    // console.log("Dealt hands:");
    // gameRoom.players.forEach((player) => {
    //   console.log(`${player.nickname}: ${player.hand}`);
    // });

    // Set the first turn player to whoever joined first
    gameRoom.currentAction = {
      turnPlayer: gameRoom.players[0].uuid,
      prevPlayer: null,
      conspiracy: [],
      card: null,
      claim: null,
    };
  }

  // Save GameRoom contents to database.
  async saveGameRoom(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    gameRoom.save();
  }

  // Saves all GameRooms to the database. (EXPENSIVE, use sparingly)
  async saveAll() {
    this.gameRoomMap.forEach((roomCode, gameRoom) => {
      gameRoom.save();
    });
  }

  // Used to end a game.
  // Will update the game status and remove it from the map.
  async terminateGameRoomAndSave(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);

    gameRoom.gameStatus = GameStatus.ENDED;

    gameRoom.save();

    this.gameRoomMap.delete(roomCode);
  }

  // Generates a roomCode that is not used by any other room.
  generateValidRoomCode() {
    const characters = 'ABDEFGHJKLMNPQRSTUWXY123456789';
    let roomCode = '';
    do {
      for (let i = 0; i < 4; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * 30));
      }
    } while (this.gameRoomMap.has(roomCode));

    return roomCode;
  }

  // Returns roomCode that the player is in by UUID.
  getRoomCodeByPlayerUUID(uuid) {
    for (const [roomCode, gameRoom] of this.gameRoomMap.entries()) {
      if (gameRoom.players.some((p) => p.uuid === uuid)) {
        return roomCode;
      }
    }
    return null;
  }
  // Set a player's socketId to a value, based on UUID, should be run every time a player connects, returns player for verification
  setPlayerSocketId(roomCode, uuid, socketId) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`setPlayerSocketId(): GameRoom ${roomCode} not found.`);
    }

    // Find the player within the room
    const player = gameRoom.players.find((p) => p.uuid === uuid);
    if (!player) {
      throw new Error(
        `setPlayerSocketId(): Player with UUID ${uuid} not found in room ${roomCode}.`
      );
    }

    player.socketId = socketId;
    return player;
  }

  // starts a new conspiracy and returns the gameRoom for that conspiracy or a -1 if it failed on turn
  startConspiracy(roomCode, senderId, receiverId, card, claim) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`startConspiracy(): GameRoom ${roomCode} not found.`);
    }

    if (gameRoom.currentAction.turnPlayer != senderId) {
      //If the player tries to send without it being its turn then it fails,
      console.log(`startConspiracy(): not current player ${senderId}'s turn`);
      return -1;
    }

    gameRoom.currentAction.conspiracy = [gameRoom.currentAction.turnPlayer];
    gameRoom.currentAction.card = card;
    gameRoom.currentAction.claim = claim;

    //Steps: Turn Current Player into the prevPlayer, targeted Player becomes currentPlayer, add currentPlayer to conspiracy.
    gameRoom.currentAction.prevPlayer = gameRoom.currentAction.turnPlayer;
    gameRoom.currentAction.turnPlayer = receiverId;

    return gameRoom;
  }

  // Getter for the current conspiracy card
  getConspiracyCard(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`getConspiracyCard(): GameRoom ${roomCode} not found.`);
    }

    return gameRoom.currentAction.card;
  }

  // add a player to the room's conspiracy
  addConspiracy(roomCode, uuid) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`addConspiracy(): GameRoom ${roomCode} not found.`);
    }
    gameRoom.currentAction.conspiracy.push(uuid);
    return;
  }

  // updates claim and sends card while returning the gameRoom, should always be run after addConspiracy
  sendCard(roomCode, receiverId, claim) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`sendCard(): GameRoom ${roomCode} not found.`);
    }
    gameRoom.currentAction.claim = claim;

    //Steps: Turn Current Player into the prevPlayer, targeted Player becomes currentPlayer, add currentPlayer to conspiracy.
    gameRoom.currentAction.prevPlayer = gameRoom.currentAction.turnPlayer;
    gameRoom.currentAction.turnPlayer = receiverId;

    return gameRoom;
  }

  // resolveTurnEnd: gets a claim from the user and see's if it matches up with the previous person who made a claim
  // If receiver correctly guesses if previous person lied, previous person gets the card in its pile, otherwise receiver gets the card in its pile
  // returns the index of the losing player
  resolveTurnEnd(roomCode, uuid, receiverClaim) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`resolveTurnEnd(): GameRoom ${roomCode} not found.`);
    }
    // conspiracyTruth is true if the claimed card matches the actual card
    let conspiracyTruth =
      gameRoom.currentAction.card === gameRoom.currentAction.claim;

    let playerObject;
    if (conspiracyTruth === receiverClaim) {
      playerObject = this.getPlayerByUUID(
        roomCode,
        gameRoom.currentAction.prevPlayer
      );
    } else {
      playerObject = this.getPlayerByUUID(roomCode, uuid);
    }

    if (!playerObject) {
      throw new Error(`resolveTurnEnd(): player object is null`);
    }

    playerObject.pile.push(gameRoom.currentAction.card);
    // Finds the player who lost and sets the turnPlayer to them
    const index = gameRoom.players.findIndex(
      (p) => p.uuid === playerObject.uuid
    );
    if (index !== -1) {
      gameRoom.players[index] = playerObject;
    }

    // Sets the turn to whoever lost the claim
    gameRoom.currentAction.turnPlayer = gameRoom.players[index].uuid;
    gameRoom.currentAction.conspiracy = [];
    gameRoom.currentAction.card = null;
    gameRoom.currentAction.claim = null;

    return index;
  }

  // checkForGameEnd: checks if a player has 4 of a kind of card in their pile, if so then they lose
  checkForGameEnd(roomCode, index) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) {
      throw new Error(`checkForGameEnd(): GameRoom ${roomCode} not found.`);
    }

    const countMap = {};
    for (let numCard of gameRoom.players[index].pile) {
      countMap[numCard] = (countMap[numCard] || 0) + 1;
      if (countMap[numCard] === 4) {
        // Four of the name number in the pile
        console.log(
          `Player ${gameRoom.players[index].nickname} has four of ${CardNumberToString[numCard]}. They lose!`
        );
        // TODO: THAT PLAYER HAS LOST!!
      }
    }
  }
}
