import { Box, Image, Text, Grid, Container, Button } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

// Initialize socket connection
const socket = io('http://localhost:5000', { autoConnect: false });

const GameBoard = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);

  // Fetch player data from the backend and update the count using Socket.IO
  useEffect(() => {
    // Connect to the socket when the component mounts
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      handleJoinRoom('123B'); // Join with room code (use the actual room code)
    };

    const handleJoinRoom = (roomCode) => {
      socket.emit('joinRoom', roomCode); // Emit event to join the room
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
  };

  // Image list based on player count
  const images = [
    { src: 'images/bat_silhouette.png', left: '5%', bottom: '5%' },
    { src: 'images/toad_silhouette.png', right: '5%', top: '5%' },
    { src: 'images/cockroach_silhouette.png', left: '5%', top: '5%' },
    {
      src: 'images/rat_silhouette.png',
      right: '5%',
      bottom: '5%',
      transform: 'scaleX(-1)',
    },
  ];

  // Adjust the images based on player count (use gameRoom.players.length if available)
  const visibleImages = images.slice(0, gameRoom ? gameRoom.players.length : 0);

  return (
    <Container>
      <Container>Socket state: {message}</Container>
      <Button onClick={() => handleRequestGameRoom()}>Request Room Info</Button>

      {/* Render the game board once gameRoom data is available */}
      {gameRoom ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100vh'
          bg='#2A9D8F'
          p={2}
        >
          <Box
            width='90%'
            height='90%'
            bg='#E9C46A'
            p={4}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            position='relative'
          >
            {/* Render game area */}
            <Box
              width='90%'
              height='90%'
              bg='#F4A261'
              borderRadius='md'
              position='relative'
              display='flex'
              justifyContent='center'
              alignItems='center'
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

              {/* Responsive Player Cards */}
              {[
                { left: '10%', top: '10%', highlight: 1 },
                { left: '10%', bottom: '10%', highlight: 6 },
                { right: '10%', top: '10%', highlight: 5 },
                { right: '10%', bottom: '10%', highlight: 4 },
              ].map((pos, index) => (
                <Grid
                  key={index}
                  templateColumns='repeat(2, 1fr)'
                  templateRows='repeat(4, 1fr)'
                  gap={1}
                  width='50px'
                  height='120px'
                  position='absolute'
                  {...pos}
                >
                  {[...Array(8)].map((_, i) => (
                    <Box
                      key={i}
                      width='100%'
                      height='100%'
                      bg={i === pos.highlight ? '#5b7553' : 'gray.200'}
                      borderRadius='md'
                    />
                  ))}
                </Grid>
              ))}

              {/* Render images based on player count */}
              {visibleImages.map((img, i) => (
                <Image
                  key={i}
                  position='absolute'
                  src={img.src}
                  width={['50px', '65px', '80px']}
                  {...img}
                />
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Container>
  );
};

export default GameBoard;
