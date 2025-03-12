import { Button, Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyPlayerPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [hand, setHand] = useState('?');
  const [name, setName] = useState('Jimbo');

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      //TODO roomCode should be inputted by the player.
      console.log('MEOW COUNTERS');
      let roomCode = '123B';
      socket.emit('connectToRoom', roomCode, name);
    };

    const handleReceiveHand = (hand) => {
      setHand(JSON.stringify(hand));
    };

    socket.on('connect', handleConnect);
    socket.on('receiveHand', handleReceiveHand);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('receiveHand', handleReceiveHand);
    };
  }, []);

  // Old function using sendCard
  //   const handleSendCockroach = () => {
  //     socket.emit('sendCard', '67ad6bd71b76340c29212842', 4);
  //   };

  // Uses gameRoomSendCard to target Players inside GameRoom objects
  const handleSendCockroach = () => {
    socket.emit('gameRoomSendCard', '123B', '12345', 3);
  };

  return (
    <Container>
      <Container>Socket state: {message}</Container>
      <Button onClick={() => handleSendCockroach()}>
        Add Cockroach to Sebastian's Hand
      </Button>
      <Container>Sebastian Hand: {hand}</Container>
    </Container>
  );
};

export default DummyPlayerPage;
