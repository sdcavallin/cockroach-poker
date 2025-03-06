import { Box, Image, Text, Grid, Container } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('http://localhost:5000', { autoConnect: false });

const GameBoard = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);

  useEffect(() => {
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
      socket.emit('joinRoom', roomCode);
    };

    const handleReturnGameRoom = (gameRoom) => {
      console.log('Received game room:', gameRoom);
      setGameRoom(gameRoom);
    };

    socket.on('connect', handleConnect);
    socket.on('returnGameRoom', handleReturnGameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnGameRoom', handleReturnGameRoom);
    };
  }, []);

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

  const visibleImages = images.slice(0, gameRoom ? gameRoom.players.length : 0);

  return (
    <Container maxW='100vw' maxH='100vh' p={0}>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        width='100vw'
        bg='#2A9D8F'
      >
        {/* Outer Game Border (Red Game Mat) */}
        <Box
          width='90vw' // Use viewport width for scaling
          height='90vh' // Use viewport height for scaling
          bg='#E9C46A'
          p={4}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          position='relative'
        >
          {/* Main Game Area */}
          <Box
            width='100%'
            height='100%'
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
    </Container>
  );
};

export default GameBoard;
