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

// Join New Game Page
const DummyJoinSetupPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [playerIcon, setPlayerIcon] = useState('nothing.png');
  const navigate = useNavigate();

  const handleJoin = () => {
    socket.emit(
      'requestJoinPlayerToRoom',
      roomCode,
      nickname,
      playerIcon,
      socket.id
    );
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
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

    const handleReturnJoinPlayerToRoom = (success, roomCode, uuid) => {
      if (success) {
        Cookies.set('roomCode', roomCode, { expires: 2 });
        Cookies.set('uuid', uuid, { expires: 2 });

        navigate('/DummyPlay', { state: { roomCode: roomCode, uuid: uuid } });
      } else {
        alert('Could not join room');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('returnJoinPlayerToRoom', handleReturnJoinPlayerToRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnJoinPlayerToRoom', handleReturnJoinPlayerToRoom);
    };
  }, []);

  return (
    <Container>
      <Text>Socket state: {message}</Text>
      <Heading size='lg'>Join a New Game</Heading>
      <Text>Room Code:</Text>{' '}
      <Input
        value={roomCode}
        onChange={handleRoomCodeChange}
        placeholder='Enter 4-letter code'
        size='sm'
      />
      <Text>Nickname:</Text>{' '}
      <Input
        value={nickname}
        onChange={handleNicknameChange}
        placeholder='Enter your name'
        size='sm'
      />
      <Button onClick={handleJoin}>Join</Button>
    </Container>
  );
};

export default DummyJoinSetupPage;
