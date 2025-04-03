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

const socket = io('http://localhost:5000', { autoConnect: false });

const DummySetupPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    const handleJoinRoom = (roomCode) => {
      socket.emit('joinRoom', roomCode);
    };

    const handleReturnGameRoom = (gameRoom) => {
      console.log(gameRoom);
      setGameRoom(gameRoom);
    };

    const handleReturnEmptyGameRoom = (gameRoom) => {
      console.log(gameRoom);
      setGameRoom(gameRoom);
      handleJoinRoom(gameRoom.roomCode);
    };

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);
    socket.on('returnEmptyGameRoom', handleReturnEmptyGameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnGameRoom', handleReturnGameRoom);
      socket.off('returnEmptyGameRoom', handleReturnEmptyGameRoom);
    };
  }, []);

  const handleRequestCreateEmptyGameRoom = () => {
    socket.emit('requestCreateEmptyGameRoom');
  };

  return (
    <Container>
      <Text>Socket state: {message}</Text>
      <Heading size='lg'>Game Setup</Heading>
      {gameRoom ? (
        <Box>
          <Stack spacing={3}>
            <Card>
              <CardBody>
                <Stack divider={<StackDivider />} spacing={3}>
                  <Heading size='lg'>
                    Join with Code: {gameRoom.roomCode}
                  </Heading>
                  {gameRoom.players.map((player, index) => (
                    <Box key={index}>
                      <Heading size='md'>Player: {player.nickname}</Heading>
                      <Text size='sm'>UUID: {player.uuid}</Text>
                      <Text size='sm'>Avatar: {player.playerIcon}</Text>
                      <Text size='sm'>Socket: {player.socketId}</Text>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
            <Button isDisabled={gameRoom.numPlayers < 2}>
              Start Game ({gameRoom.numPlayers} players)
            </Button>
          </Stack>
        </Box>
      ) : (
        <Button onClick={() => handleRequestCreateEmptyGameRoom()}>
          Create Empty Room
        </Button>
      )}
    </Container>
  );
};

export default DummySetupPage;
