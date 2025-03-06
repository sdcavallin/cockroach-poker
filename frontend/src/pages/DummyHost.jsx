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

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);

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
