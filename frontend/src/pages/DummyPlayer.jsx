import { Button, Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:5000');

const DummyPlayerPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [hand, setHand] = useState('?');

  useEffect(() => {
    socket.on('connect', () => {
      setMessage(`Connected with id ${socket.id}`);
    });
    socket.on('receiveHand', (hand) => {
      setHand(JSON.stringify(hand));
    });
  }, []);

  const handleSendCockroach = () => {
    socket.emit('sendCard', '67ad6bd71b76340c29212842', 3);
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
