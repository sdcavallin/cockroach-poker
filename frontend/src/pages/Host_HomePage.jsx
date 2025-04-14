import { useEffect, useState } from 'react';
import { Box, Text, Grid, Button, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import FlippingCard from './FlippingCard.jsx';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:5000', { autoConnect: false });

import { useLocation } from 'react-router-dom';

const StartBoard = () => {
  const location = useLocation();
  const { roomCode } = location.state || {};
  const [message, setMessage] = useState('Connecting socket...');
  const [playerCount, setPlayerCount] = useState(0); // Store the number of players
  const [isGameStarted, setIsGameStarted] = useState(false); // Track if the game has started

  const navigate = useNavigate(); // Initialize the navigate function

  // Connect to the socket and get the number of players from the backend
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      socket.emit('getPlayerCount'); // Emit event to get the current player count
    };

    const handlePlayerCount = (count) => {
      setPlayerCount(count); // Update player count with the data received from the server
    };

    socket.on('connect', handleConnect);
    socket.on('playerCount', handlePlayerCount); // Listen for the player count update from the server

    // Cleanup on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('playerCount', handlePlayerCount);
    };
  }, []);

  // Check if the player count is loaded
  if (playerCount === null) {
    return <Text>Loading player count...</Text>;
  }

  // Start Game button functionality
  const handleStartGame = () => {
    setIsGameStarted(true);
    navigate('/gameboard', { state: { roomCode } }); 
  };
  
  return (
    <Container
      maxW='100vw'
      maxH='100vh'
      p={0}
      bg='#2A9D8F'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      height='100vh'
    >
      {/* Top Row of Cards */}
      <Grid
  templateColumns="repeat(3, 1fr)" 
  gap="4"
  mt="4"
  justifyItems="center"
  width="80%"
>
  {[...Array(3)].map((_, index) => (
    <FlippingCard
      key={index}
      isFlipped={index < playerCount}
      width="10vw"
      height="15vw"
      backImage="/cards/back.png"
    />
  ))}
</Grid>


      {/* Center Section */}
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='30%'
        mt={4}
      >
        <Text
          fontSize={{ base: '6vw', md: '4vw', lg: '5vw' }}
          color='#264653'
          fontWeight='bold'
          mb={4}
        >
          Cockroach Poker
        </Text>

        <Button
          onClick={handleStartGame}
          bg='#E9C46A'
          color='#264653'
          fontSize={{ base: '4vw', md: '2vw' }}
          _hover={{ bg: '#E76F51' }}
          px='6'
          py='4'
          mb={4}
        >
          Start Game
        </Button>

        <Text
  fontSize={{ base: '5vw', md: '2vw' }}
  color='#264653'
  fontWeight='bold'
>
  Room Code: {roomCode || 'N/A'}
</Text>

      </Box>

      {/* Bottom Row of Cards */}
      <Grid
  templateColumns="repeat(3, 1fr)" 
  gap="4"
  mb="4"
  justifyItems="center"
  width="80%"
>
  {[...Array(3)].map((_, index) => (
    <FlippingCard
      key={index + 3} 
      isFlipped={index + 3 < playerCount}
      width="10vw"
      height="15vw"
      backImage="/cards/back.png"
    />
  ))}
</Grid>

    </Container>
  );
};

export default StartBoard;
