import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
<<<<<<< HEAD
import { updateGameRoom } from '../../../backend/controllers/gameroom.controller';
=======
>>>>>>> 067af08 (Create GameRoomService to manage gameRooms in memory)

const socket = io('http://localhost:5000', { autoConnect: false });

const DummyHostPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      handleJoinRoom('123B');
    };

    const handleJoinRoom = (roomCode) => {
      socket.emit('joinRoom', roomCode);
    };

    const handleReturnGameRoom = (gameRoomMew) => {
      console.log('Before Game Room ', gameRoomMew);
      setGameRoom(gameRoomMew);
    };

    const handlePlayerJoined = ({ uuid, storedSocketId, name }) => {
      console.log('Player Joined2:', uuid, storedSocketId, name);
      let inElegantRunOnce = true;
      setGameRoom((prevGameRoom) => {
        if (!prevGameRoom || !inElegantRunOnce) return prevGameRoom;
        console.log('Player Joined', prevGameRoom);
        inElegantRunOnce = false;
        //If a player has joined check if gameRoom already has UUID, if so then update the socketid, if not add new player.
        const updatedGameRoom = { ...prevGameRoom }; // Copy previous game room data
        if (updatedGameRoom.players.length === 0) {
          //addPlayer(uuid, socketID, updatedGameRoom, name);
        } else {
          let newPlayer = true;
          updatedGameRoom.players = updatedGameRoom.players.map((player) => {
            if (String(player.uuid) === String(uuid)) {
              console.log(
                `Updating socketId for ${player.nickname}, with socket ${storedSocketId}`
              );
              newPlayer = false;
              player.socketId = storedSocketId;
              console.log(`Player Socket ${player.socketId}`);
              return { ...player, socketId: storedSocketId };
            }
            return player; // Return unchanged player if no match
          });
          if (newPlayer) {
            console.log('Mew');
            //addPlayer(uuid, socketID, prevGameRoom, name);
          }
        }
        console.log('Updated Game Room:', updatedGameRoom);
        return updatedGameRoom;
      });
    };

    const addPlayer = (uuid, socketID, prevGameRoom, name) => {
      //NEEDS TO CALL THE BACKEND TO CREATE A PLAYER OBJECT AND THEN ADD IT TO THE HOST'S GAME
      const newPlayer = {
        uuid: uuid,
        nickname: name,
        playerIcon: '.png', // Default icon (or could be dynamically set)
        hand: [],
        handSize: 0,
        pile: [],
        pileSize: 0,
        socketId: socketID,
      };

      //Idk this was kinda confusing implementation
      const updatedGameRoom = {
        ...prevGameRoom, // This copies the previous game room
        players: [...prevGameRoom.players, newPlayer], // this adds the new player to the array
      };

      // Respect immutability by returning a new room instead of trying to alter the previous one.
      return updatedGameRoom;
    };

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);
    socket.on('playerJoined', handlePlayerJoined);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnGameRoom', handleReturnGameRoom);
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, []);
  /*
  useEffect(() => {
    // This effect runs whenever `gameRoom` changes
    if (gameRoom) {
      console.log('Updated gameRoom:', gameRoom);
    }
  }, [gameRoom]); // Runs when `gameRoom` changes
*/
  const handleRequestGameRoom = () => {
    socket.emit('requestGameRoom', '123B');
  };

  return (
    <Container>
      <Container>Socket state: {message}</Container>
      <Button onClick={() => handleRequestGameRoom()}>Request Room Info</Button>
      {gameRoom ? (
        <Card>
          <CardHeader>
            <Heading size='lg'>Game Room: {gameRoom.roomCode}</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              {gameRoom.players.map((player, index) => (
                <Box key={index}>
                  <Heading size='md'>Player: {player.nickname}</Heading>
                  <Text size='sm'>Hand: {JSON.stringify(player.hand)}</Text>
                  <Text size='sm'>Pile: {JSON.stringify(player.pile)}</Text>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>
      ) : (
        ''
      )}
    </Container>
  );
};

export default DummyHostPage;
