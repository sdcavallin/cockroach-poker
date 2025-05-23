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
    if (gameRoom.gameStatus === GameStatus.ONGOING) return;

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

    // Deal cards evenly (just divide all cards among players)
    const numPlayers = gameRoom.players.length;
    const cardsPerPlayer = Math.floor(numCards / numPlayers);

    gameRoom.players.forEach((player, index) => {
      const start = index * cardsPerPlayer;
      const end = start + cardsPerPlayer;
      player.hand = deck.slice(start, end);
      player.handSize = player.hand.length;
    });

    // Set the first turn player to whoever joined first
    gameRoom.currentAction = {
      turnPlayer: gameRoom.players[0].uuid,
      prevPlayer: gameRoom.players[0].uuid,
      conspiracy: [],
      card: -1,
      claim: -1,
    };
  }

  // Starts a round of play.
  startRound(roomCode, fromPlayer, toPlayer, card, claim) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    const currentAction = gameRoom.currentAction;

    // Make sure fromPlayer is the first player in a round
    if (
      fromPlayer != currentAction.turnPlayer ||
      currentAction.turnPlayer != currentAction.prevPlayer
    ) {
      console.warn(
        `Error: startRound: Only the turnPlayer at the start of a round can start a round`
      );
      return false;
    }

    // Remove the card from fromPlayer hand
    this.removeCardFromHand(roomCode, fromPlayer, card);

    // Update currentAction
    gameRoom.currentAction = {
      turnPlayer: toPlayer,
      prevPlayer: fromPlayer,
      conspiracy: [fromPlayer],
      card: card,
      claim: claim,
    };

    // Return (send this update to everyone)
    return true;
  }

  // Player looks at the current card and passes it to someone else.
  passCard(roomCode, fromPlayer, toPlayer, claim) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    const currentAction = gameRoom.currentAction;

    // Make sure fromPlayer is the turn player
    if (fromPlayer != currentAction.turnPlayer) {
      console.warn(`Error: passCard: Only the turnPlayer can pass a card.`);
      return false;
    }

    // Make sure toPlayer has not seen the card
    if (currentAction.conspiracy.includes(toPlayer)) {
      console.warn(
        `Error: passCard: Can't pass a card to someone in conspiracy.`
      );
      return false;
    }

    // Pass card
    gameRoom.currentAction = {
      turnPlayer: toPlayer,
      prevPlayer: fromPlayer,
      conspiracy: [...currentAction.conspiracy, fromPlayer],
      card: currentAction.card,
      claim: claim,
    };

    return true;
  }

  // Player calls the current card as true or false.
  callCard(roomCode, fromPlayer, callAs) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    const currentAction = gameRoom.currentAction;

    // Make sure playerId is the turn player
    if (fromPlayer != currentAction.turnPlayer) {
      console.warn(`Error: callCard: Only the turnPlayer can call a card.`);
      return false;
    }

    // Whether the previous player's claim was true or false
    const reality = currentAction.card === currentAction.claim;

    // Determine who lost the round
    const loser =
      callAs === reality ? currentAction.prevPlayer : currentAction.turnPlayer;

    // Add the card to the loser's pile
    this.addCardToPile(roomCode, loser, currentAction.card);

    // Update currentAction to start a new round
    gameRoom.currentAction = {
      turnPlayer: loser,
      prevPlayer: loser,
      conspiracy: [],
      card: 0,
      claim: 0,
    };

    return true;
  }

  // Check loss condition and end the game if player lost.
  endGameIfLossCondition(roomCode) {
    const gameRoom = this.gameRoomMap.get(roomCode);
    if (!gameRoom) return false;

    const players = gameRoom.players;

    for (const player of players) {
      const pile = player.pile;
      const hand = player.hand;

      // Secondary Loss Condition
      if (hand.length === 0) {
        this.terminateGameRoomAndSave(roomCode);
        return player.uuid;
      }

      let freq = Array.from({ length: 9 }, () => 0);
      for (const card of pile) {
        freq[card]++;
      }
      for (const num of freq) {
        // Primary Loss Condition
        if (num >= 4) {
          this.terminateGameRoomAndSave(roomCode);
          return player.uuid;
        }
      }
    }
    return false;
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

  // Add a card of a certain type to a player's pile
  addCardToPile(roomCode, playerId, card) {
    const player = this.getPlayerByUUID(roomCode, playerId);

    let pile = player.pile;

    pile.push(card);

    player.pileSize++;
  }

  // Remove card of a certain type from player's hand
  removeCardFromHand(roomCode, playerId, card) {
    const player = this.getPlayerByUUID(roomCode, playerId);

    let hand = player.hand;

    const index = hand.indexOf(card);
    if (index > -1) {
      hand.splice(index, 1);
    } else {
      console.warn('Error: removeCardFromHand: no such card in hand.');
      return;
    }

    player.handSize--;
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
}
