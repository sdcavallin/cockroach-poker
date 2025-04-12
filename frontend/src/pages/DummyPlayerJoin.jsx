import { Container, Button, Textarea } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect, useCallback } from 'react';
import DummyPlayerPage from './DummyPlayer.jsx';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyPlayerJoinPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    if (socket.connected && roomCode != '') {
      Socket.emit('checkJoinCode', roomCode);
    }

    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  const handleJoinCode = useCallback(
    (roomExists) => {
      if (roomExists) {
        //Tranfer screen to DummyPlayer
        console.log(
          `Valid room code & transfering ${roomCode} and ${nickname}`
        );
        navigate('/dummyplayer', { state: { roomCode, nickname } });
      } else {
        console.log('Invalid room code');
      }
    },
    [roomCode, nickname, navigate]
  );

  useEffect(() => {
    socket.on('receiveJoinCode', handleJoinCode);

    return () => {
      socket.off('receiveJoinCode', handleJoinCode);
    };
  }, [handleJoinCode]);

  const handleConnectToPlayer = (event) => {
    if (roomCode.trim() === '' || nickname.trim() === '') {
      alert('Please enter both a room code and a nickname');
      return;
    }
    socket.emit('checkJoinCode', roomCode);
  };

  return (
    <Container>
      <Container>Socket state: {message}</Container>
      <Container> Connect to a Room</Container>
      <Textarea
        size='sm'
        placeHolder='Enter Room Code'
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <Textarea
        size='sm'
        placeholder='Enter Nickname'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button onClick={handleConnectToPlayer}>Connect to Room</Button>
    </Container>
  );
};

export default DummyPlayerJoinPage;
