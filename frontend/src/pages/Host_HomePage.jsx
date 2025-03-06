import { useEffect, useState } from 'react';
import { Box, Text, Grid, Button, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import FlippingCard from './FlippingCard.jsx';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:5000', { autoConnect: false });

const StartBoard = () => {
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
    setIsGameStarted(true); // Set the game as started
    navigate('/gameboard'); // Programmatically navigate to the game board page
  };

  return (
    <Container
      maxW='100vw'
      maxH='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
      bg='#2A9D8F'
      p={0}
      flexDirection='column'
      height='100vh' // Ensure the container takes full height
    >
      {/* Full blue header area */}
      <Box
        bg='#2A9D8F'
        width='100vw'
        height='100vh' // Ensure the blue box takes full screen height
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        position='absolute' // Make the header area take up the full screen
        top='0'
        left='0'
      >
        {/* Cockroach Poker Title */}
        <Text
          position='relative'
          top={{ base: '2%', md: '1%' }}
          left={{ base: '3%', md: '5%' }}
          fontSize={{ base: '6vw', md: '4vw' }}
          color='#264653'
          fontWeight='bold'
          zIndex={10}
        >
          Cockroach Poker
        </Text>

        {/* Start Game Button */}
        <Button
          onClick={handleStartGame} // This will start the game and navigate to the GameBoard
          width={{ base: '70%', md: '20%' }}
          height={{ base: '10%', md: '12%' }}
          bg='#E9C46A'
          color='#264653'
          fontSize={{ base: '4vw', md: '3vw' }}
          position='relative'
          bottom='10%'
          left='50%'
          transform='translateX(-50%)'
          _hover={{ bg: '#E76F51' }}
          zIndex={10}
        >
          Start Game
        </Button>

        {/* Room Code */}
        <Text
          position='relative'
          top={{ base: '30%', md: '30%' }}
          left={{ base: '5%', md: '20%' }}
          fontSize={{ base: '7vw', md: '5vw' }}
          color='#264653'
          fontWeight='bold'
          mt={4}
          zIndex={10}
        >
          room code: SKD33
        </Text>
      </Box>

      {/* Cards Grid - 2 rows, 4 cards per row */}
      <Grid
        templateColumns='repeat(4, 1fr)' // 4 columns for 4 cards per row
        templateRows='repeat(2, 1fr)' // 2 rows
        gap='10%' // Space between cards
        width='80%' // Adjust grid width to be centered
        justifyItems='center' // Center cards inside the grid
      >
        {[...Array(8)].map((_, index) => (
          <FlippingCard
            key={index}
            frontColor={index === 3 ? '#a3b18a' : '#F4A261'}
            backColor={index % 2 === 0 ? '#E9C46A' : '#F4A261'}
            isFlipped={index < playerCount} // Flip based on player count
            width='10vw'
            height='15vw'
          />
        ))}
      </Grid>
    </Container>
  );
};

export default StartBoard;
