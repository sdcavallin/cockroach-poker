import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import {
  CardNumberToString,
  Cards,
  GAME_ROOM_PREFIX,
  GameStatus,
} from './utilities/constants.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameRoomService } from './services/gameroom.service.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8420;

// Create an HTTP server and attach Express
const server = createServer(app);

// SocketIO
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for security
  },
});

// Allows us to parse JSON data in request body
app.use(express.json());

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

const gameRoomService = new GameRoomService();

// Initialize GameRoomService
(async () => {
  await gameRoomService.initializeGameRoomMap();
})();

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  const sendGameRoomToEveryoneInRoom = (roomCode) => {
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    io.to(GAME_ROOM_PREFIX + roomCode).emit('returnGameRoom', gameRoom);
  };

  const sendNewRoundInfoToEveryoneInRoom = (roomCode) => {
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    const loserId = gameRoom.currentAction.turnPlayer;
    const loser = gameRoomService.getPlayerByUUID(roomCode, loserId);
    io.to(GAME_ROOM_PREFIX + roomCode).emit(
      'returnNewRound',
      loserId,
      loser.nickname
    );
  };

  const endGameIfLossCondition = (roomCode) => {
    const gameOver = gameRoomService.endGameIfLossCondition(roomCode);
    if (gameOver) {
      io.to(GAME_ROOM_PREFIX + roomCode).emit('returnGameOver', gameOver);
    }
  };

  // requestGameRoom: request for GameRoom data from a host
  socket.on('requestGameRoom', async (roomCode) => {
    console.log(`Socket ${socket.id} requested GameRoom info for ${roomCode}`);
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });

  // requestCreateEmptyGameRoom: request to create an empty GameRoom and return it
  socket.on('requestCreateEmptyGameRoom', async () => {
    console.log(`Socket ${socket.id} requested to create an empty GameRoom`);
    const gameRoom = gameRoomService.createEmptyGameRoom();
    socket.emit('returnEmptyGameRoom', gameRoom);
  });

  socket.on('requestStartGame', async (roomCode) => {
    console.log(`Socket ${socket.id} requested to start game ${roomCode}`);
    gameRoomService.startGame(roomCode);
    console.log(`Emitting returnStartGame for room ${roomCode}`);
    socket.emit('returnStartGame', roomCode);
    sendGameRoomToEveryoneInRoom(roomCode);
  });

  // requestJoinPlayerToRoom: request to create a new player in a GameRoom that is in SETUP
  socket.on(
    'requestJoinPlayerToRoom',
    async (roomCode, nickname, playerIcon, socketId) => {
      const gameRoom = gameRoomService.getGameRoom(roomCode);
      if (
        !gameRoom ||
        gameRoom.gameStatus != GameStatus.SETUP ||
        gameRoom.numPlayers > 6 ||
        nickname.length > 16
      ) {
        socket.emit('returnJoinPlayerToRoom', false, null, null);
      } else {
        const uuid = gameRoomService.addPlayerToGameRoom(
          roomCode,
          nickname,
          playerIcon,
          socketId
        );
        socket.emit('returnJoinPlayerToRoom', true, roomCode, uuid);
        const updatedGameRoom = gameRoomService.getGameRoom(roomCode);
        socket
          .to(GAME_ROOM_PREFIX + roomCode)
          .emit('returnGameRoom', updatedGameRoom);
      }
    }
  );

  // checkJoinCode: checks if the room exists for a roomCode, from player
  socket.on('checkJoinCode', async (roomCode) => {
    console.log(`Socket ${socket.id} requested GameRoom info for ${roomCode}`);
    //roomExists is a boolean
    let roomExists = false;

    const gameRoom = gameRoomService.getGameRoom(roomCode);

    if (gameRoom == undefined) {
      console.log('Game Code is false');
      roomExists = false;
    } else {
      roomExists = true;
    }
    socket.emit('receiveJoinCode', roomExists);
  });

  // joinSocketRoom: socket room join; only used by hosts as of now
  socket.on('joinSocketRoom', async (roomCode) => {
    socket.join(GAME_ROOM_PREFIX + roomCode);
    console.log(
      `Socket ${socket.id} joined room ${GAME_ROOM_PREFIX + roomCode}`
    );
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    socket.emit('returnGameRoom', gameRoom);
  });

  // selectAvatar: update avatar in memory (no DB call)
  socket.on('selectAvatar', ({ playerId, avatar }) => {
    try {
      const roomCode = gameRoomService.getRoomCodeByPlayerUUID(playerId);
      if (!roomCode) {
        console.warn(`No room found for player UUID: ${playerId}`);
        return;
      }

      const gameRoom = gameRoomService.getGameRoom(roomCode);
      const player = gameRoom.players.find((p) => p.uuid === playerId);

      if (!player) {
        console.warn(
          `Player with UUID ${playerId} not found in GameRoom ${roomCode}`
        );
        return;
      }

      player.playerIcon = avatar;
      console.log(`Avatar updated for ${player.nickname}: ${avatar}`);

      socket.emit('avatarUpdated', { success: true, avatar });
    } catch (error) {
      console.error('Error: Could not update avatar in memory:', error);
      socket.emit('avatarUpdated', {
        success: false,
        message: 'Failed to update avatar',
      });
    }
  });

  // getPlayer: returns a player by roomCode and uuid
  socket.on('getPlayer', (roomCode, uuid) => {
    try {
      // Use gameRoomService to get the game room
      const gameRoom = gameRoomService.getGameRoom(roomCode);

      if (!gameRoom) {
        console.warn(`No game room found for room code: ${roomCode}`);
        socket.emit('returnPlayer', null);
        return;
      }

      // Find the player in the game room
      const player = gameRoom.players.find((p) => p.uuid === uuid);

      if (player) {
        console.log(`Player found: ${player.nickname}`);
        socket.emit('returnPlayer', player);
      } else {
        console.warn(`No player found with UUID: ${uuid} in room: ${roomCode}`);
        socket.emit('returnPlayer', null);
      }
    } catch (error) {
      console.error('Error in getPlayer:', error);
      socket.emit('returnPlayer', null);
    }
  });

  // setSocketId: sets a player by roomCode and uuid's socket to socketId
  socket.on('setSocketId', (roomCode, uuid, socketId) => {
    // Use gameRoomService to check if the gameRoom is real
    console.log(`Socket ID: ${socketId}`);
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    if (!gameRoom) {
      console.warn(`No game room found for room code: ${roomCode}`);
      return;
    }

    //calls setPlayerSocketId in gameRoomService
    const player = gameRoomService.setPlayerSocketId(roomCode, uuid, socketId);
    if (!player) {
      console.warn(
        `setPlayerSocketId(): Player with UUID ${uuid} not found in room ${roomCode}.`
      );
    }
  });

  // requestPlayerStartRound: player starts a round by sending a card to someone.
  socket.on(
    'requestPlayerStartRound',
    (roomCode, fromPlayer, toPlayer, card, claim) => {
      console.log(
        `[${roomCode}] Player ${fromPlayer} requests send card ${card} and claim ${claim} to ${toPlayer}`
      );
      if (!roomCode) {
        console.warn(`Error: requestPlayerStartRound: No room code provided`);
        return;
      }
      const gameRoom = gameRoomService.getGameRoom(roomCode);
      if (!gameRoom) {
        console.warn(
          `Error: requestPlayerStartRound: Game room ${roomCode} not found`
        );
        return;
      }

      const success = gameRoomService.startRound(
        roomCode,
        fromPlayer,
        toPlayer,
        card,
        claim
      );

      if (success) {
        sendGameRoomToEveryoneInRoom(roomCode);
      } else {
        console.warn('gameRoomService.startRound() failed');
      }
    }
  );

  // requestPlayerPassCard: player looks at the current card and passes it to someone else with a claim.
  socket.on(
    'requestPlayerPassCard',
    (roomCode, fromPlayer, toPlayer, claim) => {
      console.log(
        `[${roomCode}] Player ${fromPlayer} requests pass current card with claim ${claim} to ${toPlayer}`
      );
      if (!roomCode) {
        console.warn(`Error: requestPlayerPassCard: No room code provided`);
        return;
      }
      const gameRoom = gameRoomService.getGameRoom(roomCode);
      if (!gameRoom) {
        console.warn(
          `Error: requestPlayerPassCard: Game room ${roomCode} not found`
        );
        return;
      }

      const success = gameRoomService.passCard(
        roomCode,
        fromPlayer,
        toPlayer,
        claim
      );

      if (success) {
        sendGameRoomToEveryoneInRoom(roomCode);
      } else {
        console.warn('gameRoomService.passCard() failed');
      }
    }
  );

  // requestPlayerCallCard: player calls a claim as true or false.
  socket.on('requestPlayerCallCard', (roomCode, fromPlayer, callAs) => {
    console.log(
      `[${roomCode}] Player ${fromPlayer} requests call current card with callAs ${callAs}`
    );
    if (!roomCode) {
      console.warn(`Error: requestPlayerCallCard: No room code provided`);
      return;
    }
    const gameRoom = gameRoomService.getGameRoom(roomCode);
    if (!gameRoom) {
      console.warn(
        `Error: requestPlayerCallCard: Game room ${roomCode} not found`
      );
      return;
    }
    const prevPlayer = gameRoom.currentAction?.prevPlayer;

    const success = gameRoomService.callCard(roomCode, fromPlayer, callAs);

    if (success) {
      sendGameRoomToEveryoneInRoom(roomCode);
      sendNewRoundInfoToEveryoneInRoom(roomCode);
      endGameIfLossCondition(roomCode);
    } else {
      console.warn('gameRoomService.callCard() failed');
    }
  });
});
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
