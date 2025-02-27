import { Button, Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:5000', { autoConnect: false });

const DummyPlayerPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [hand, setHand] = useState('?');

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
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

  const handleSendCockroach = () => {
    socket.emit('sendCard', '67ad6bd71b76340c29212842', 4);
  };

  return (
    <Container>
      <Button onClick={() => handleSendCockroach()}>
        Add Cockroach to Sebastian's Hand
      </Button>
      <Container>Socket state: {message}</Container>
      <Container>Sebastian Hand: {hand}</Container>
    </Container>
  );
};

export default DummyPlayerPage;
