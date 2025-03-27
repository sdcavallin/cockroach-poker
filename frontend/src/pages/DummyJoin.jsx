import {
  Button,
  Container,
  Divider,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyJoinPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('123B');
  const [uuid, setUUID] = useState('12345');
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/DummyPlay', { state: { roomCode: roomCode, uuid: uuid } });
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleUUIDChange = (event) => {
    setUUID(event.target.value);
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  return (
    <Container>
      <Text>Socket state: {message}</Text>
      <Heading size='lg'>Rejoin an Ongoing Game</Heading>
      <Text>Room Code:</Text>{' '}
      <Input
        value={roomCode}
        onChange={handleRoomCodeChange}
        placeholder='123B'
        size='sm'
      />
      <Text>UUID:</Text>{' '}
      <Input
        value={uuid}
        onChange={handleUUIDChange}
        placeholder='12345'
        size='sm'
      />
      <Button onClick={handleJoin}>Join</Button>
    </Container>
  );
};

export default DummyJoinPage;
