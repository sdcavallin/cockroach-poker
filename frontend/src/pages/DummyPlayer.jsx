import { Button, Container, Divider, Input } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

// Old
const DummyPlayerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, nickname } = location.state || {};
  const [message, setMessage] = useState('Connecting socket...');
  const [hand, setHand] = useState('?');
  const [UUID, setUUID] = useState('0');

  useEffect(() => {
    //Redirects if data is missing.
    if (!roomCode || !nickname) {
      console.log('No roomCode or nickname found. Redirecting...');
      navigate('/dummyplayerjoin');
    }
  }, [roomCode, nickname, navigate]);

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

    const handleSetUUID = (userUUID) => {
      let playerUUID = Cookies.get('player_uuid');
      if (!playerUUID) {
        setUUID(userUUID);
        Cookies.set('player_uuid', userUUID, { expires: 2 }, { secure: true });
      } else {
        setUUID(playerUUID);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('receiveHand', handleReceiveHand);
    socket.on('setUUID', handleSetUUID);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('receiveHand', handleReceiveHand);
    };
  }, [location]); //This should ensure that this runs whenever navigated to.

  useEffect(() => {
    if (location.state) {
      socket.emit('getPlayer', location.state.roomCode, UUID);
    }
  }, [location.state]);

  const handleReturnPlayer = (player) => {
    setPlayer(player);
  };

  socket.on('returnPlayer', handleReturnPlayer);

  // Uses gameRoomSendCard to target Players inside GameRoom objects
  const handleSendCockroach = () => {
    socket.emit('gameRoomSendCard', '123B', '12345', 3);
  };

  const handleConnectToRoom = (event) => {
    //TODO roomCode should be inputted by the player.
    //let roomCode = '123B';
    console.log(
      `Attempting to connect to room ${roomCode} with nickname ${nickname} and ${socket.connected}`
    );
    socket.emit('connectToRoom', roomCode, nickname);
  };

  return (
    <Container>
      <Container>Socket state: {message}</Container>
      <Button onClick={() => handleSendCockroach()}>
        Add Cockroach to {nickname}'s Hand
      </Button>
      <Container>
        {nickname}'s Hand: {hand}
      </Container>
      <Container>
        {nickname} UUID: {UUID}
      </Container>
      <Button onClick={() => handleConnectToRoom()}>
        Connect to Room {roomCode}
      </Button>
    </Container>
  );
};

export default DummyPlayerPage;
