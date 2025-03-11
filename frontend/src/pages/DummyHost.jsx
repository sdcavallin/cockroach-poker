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
import { PlayerSchema } from '../../../backend/models/player.model';

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

    const handleReturnGameRoom = (gameRoom) => {
      console.log(gameRoom);
      setGameRoom(gameRoom);
    };

    const handlePlayerJoined = (uuid, socketID, gameRoom) => {
      console.log(gameRoom);
      //If a player has joined check if gameRoom already has UUID, if so then update the socketid, if not add new player.
      if (gameRoom.players.length == 0) {
        //if gameRoom is empty then the player must be new
      }
      const iterator = gameRoom.players[Symbol.iterator]();
      let i = 0;
      let checkplayer = iterator.next();
      while (!checkplayer.done) {
        console.log(`Player Name ${checkplayer.nickname} Checked`);
        if (checkplayer.uuid === uuid) {
          //socketId is the PlayerSchema verson, socketID is the parameter of the function.
          checkplayer.value.socketId = socketID;
        }
        i++;
        checkplayer = iterator.next();
      }

      //do not touch
      setGameRoom(gameRoom);
    };

    const addPlayer = () => {};

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);
    socket.on('playerJoined', handlePlayerJoined);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnGameRoom', handleReturnGameRoom);
    };
  }, []);

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
