import { Box, Text, Button, Container, Image } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

// Initialize socket connection
const socket = io('http://localhost:5000', { autoConnect: false });

const GameBoard = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false); // Track if game has started

  // Fetch player data from the backend and update the count using Socket.IO
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    const handleReturnGameRoom = (gameRoom) => {
      console.log(gameRoom); // Log game room data for debugging
      setGameRoom(gameRoom); // Update state with the game room data
    };

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);

    // Cleanup on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnGameRoom', handleReturnGameRoom);
    };
  }, []);

  // Request game room data
  const handleRequestGameRoom = () => {
    socket.emit('requestGameRoom', '123B'); // Replace with actual room code
    setIsGameStarted(true); // Game has started, show game board
  };

  // chakra ui breakpoints for screen sizes : base = default for all screens, sm = mobile , md = tablet, lg = laptop, xl = desktop
  const images = [
    // Corners
    { src: 'avatars/bmo.png', right: '5%', bottom: '5%' }, // P1 - bottom right
    { src: 'avatars/finn.png', right: '5%', top: '5%' },    // P2 - top right
    { src: 'avatars/navi-avatar.png', left: '5%', top: '5%' },     // P3 - top left
    { src: 'avatars/harry-potter.png', left: '5%', bottom: '5%' },  // P4 - bottom left
  
    // Top & bottom Centers
    { src: 'avatars/jake.png', left: '50%', top: '0%', transform: 'translateX(-50%)' },    // P5 - top center
    { src: 'avatars/wonder-woman.png', left: '50%', bottom: '0%', transform: 'translateX(-50%)' }, // P6 - bottom center
  ];
  

  // Adjust the images based on player count (use gameRoom.players.length if available)
  const visibleImages = images.slice(0, gameRoom ? Math.min(gameRoom.players.length, 6) : 0);

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
    >
      {!isGameStarted && (
        <>
          {/* Request Room Info Button */}
          <Button
            onClick={handleRequestGameRoom}
            width={{ base: '100%', md: '100%', lg: '100%', xl: '100%' }} // Square shape
            height={{ base: '100%', md: '100%', lg: '100%', xl: '100%' }}
            bg='#E9C46A'
            color='#264653'
            fontSize={{ base: '7vw', md: '7vw', lg: '7vw', xl: '7vw' }} // Larger font size
            position='fixed' // Ensures the button is centered relative to the viewport
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)' // Proper centering
            display='flex'
            alignItems='center'
            justifyContent='center'
            borderRadius='md'
            _hover={{ bg: '#E76F51' }}
            zIndex={1000} // Ensures it appears on top
          >
            Enter Game
          </Button>
        </>
      )}

      {/* Render the game board once gameRoom data is available */}
      {isGameStarted && gameRoom ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100vh'
          bg='#E9C46A'
          p={4}
          position='relative'
          width='100%'
        >
          <Box
            width='90%'
            height='90%'
            bg='#F4A261'
            p={4}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            position='relative'
            borderRadius='md'
          >
            <Text
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
              fontSize={['30px', '40px', '50px']}
              fontWeight='bold'
              color='#264653'
              textAlign='center'
              opacity={0.2}
            >
              Cockroach Poker
            </Text>

            {/* Render images based on player count */}
            {visibleImages.map((img, i) => (
  <Image
    key={i}
    position="absolute"
    src={img.src}
    width={['50px', '65px', '80px']}
    {...img} // spreads the position styles
  />
))}

          </Box>
        </Box>
      ) : // <Text>Loading Game...</Text>
      null}
    </Container>
  );
};

export default GameBoard;
