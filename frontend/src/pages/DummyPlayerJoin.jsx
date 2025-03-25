import { Button, Field, Input, Stack, Textarea } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyPlayerJoinPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('');

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

    const handleJoinCode = ({ roomExists }) => {
      if (roomExists) {
        //Tranfer screen to DummyPlayer
      } else {
        console.log('Invalid room code');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('recieveJoinCode', handleJoinCode);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('recieveJoinCode', handleJoinCode);
    };
  }, []);

  // Old function using sendCard
  //   const handleSendCockroach = () => {
  //     socket.emit('sendCard', '67ad6bd71b76340c29212842', 4);
  //   };

  const handleConnectToPlayer = (event) => {
    //TODO roomCode should be inputted by the player.
    if (roomCode.trim() === '') {
      alert('Please enter a room code');
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
      <Button onClick={handleConnectToPlayer}>Connect to Room</Button>
    </Container>
  );
};

export default DummyPlayerJoinPage;
