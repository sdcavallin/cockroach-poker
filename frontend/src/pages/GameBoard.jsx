import { Box, Text, Container, Image } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000', { autoConnect: false });

const CardNumberToImage = {
  0: '/cards/rat.png',
  1: '/cards/fly.png',
  2: '/cards/roach.png',
  3: '/cards/spider.png',
  4: '/cards/bat.png',
  5: '/cards/stinkbug.png',
  6: '/cards/frog.png',
  7: '/cards/scorpion.png',
};

const getPilePosition = (img) => {
  if (img.top && img.left) return { top: '5%', left: '15%' };
  if (img.top && img.right) return { top: '5%', right: '15%' };
  if (img.bottom && img.left) return { bottom: '5%', left: '15%' };
  if (img.bottom && img.right) return { bottom: '5%', right: '15%' };
  if (img.top && img.left === '50%') return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
  if (img.bottom && img.left === '50%') return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
  return {};
};

const images = [
  { src: 'avatars/bmo.png', right: '5%', bottom: '5%' },
  { src: 'avatars/finn.png', right: '5%', top: '5%' },
  { src: 'avatars/navi-avatar.png', left: '5%', top: '5%' },
  { src: 'avatars/harry-potter.png', left: '5%', bottom: '5%' },
  { src: 'avatars/jake.png', left: '50%', top: '0%', transform: 'translateX(-50%)' },
  { src: 'avatars/wonder-woman.png', left: '50%', bottom: '0%', transform: 'translateX(-50%)' },
];

const CardNumberToString = {
  0: 'Rat',
  1: 'Fly',
  2: 'Cockroach',
  3: 'Spider',
  4: 'Bat',
  5: 'Stinkbug',
  6: 'Toad',
  7: 'Scorpion',
};

const GameBoard = () => {
  const location = useLocation(); 
  const { roomCode } = location.state || {};

  const [gameRoom, setGameRoom] = useState(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log(`Connected with id ${socket.id}`);
      if (roomCode) {
        socket.emit('requestGameRoom', roomCode); 
      }
    });

    socket.on('returnGameRoom', (room) => {
      console.log("Received returnGameRoom", room); 
      setGameRoom(room);
    });

    return () => {
      socket.off('connect');
      socket.off('returnGameRoom');
    };
  }, [roomCode]);
  const visibleImages = images.slice(0, gameRoom ? Math.min(gameRoom.players.length, 6) : 0);

  
  return (
    <Container
      maxW="100vw"
      maxH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="#2A9D8F"
      p={0}
      flexDirection="column"
    >
      {gameRoom && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bg="#E9C46A"
          p={4}
          position="relative"
          width="100%"
        >
          <Box
            width="90%"
            height="90%"
            bg="#F4A261"
            p={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="relative"
            borderRadius="md"
          >
            <Text
              position="absolute"
              top="4"
              fontSize="xl"
              fontWeight="bold"
              color="#264653"
            >
              Room Code: {roomCode}
            </Text>

            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize={['30px', '40px', '50px']}
              fontWeight="bold"
              color="#264653"
              textAlign="center"
              opacity={0.2}
            >
              Cockroach Poker
            </Text>

            {visibleImages.map((img, i) => {
              const player = gameRoom.players[i];
              const pileCounts = player?.pile?.reduce((acc, card) => {
                acc[card] = (acc[card] || 0) + 1;
                return acc;
              }, {});

              return (
                
                <Box key={`player-${i}`}>
                  <Image
                    position="absolute"
                    src={img.src}
                    width={['50px', '65px', '80px']}
                    {...img}
                    zIndex={2}
                  />
                    <Box
                      position="absolute"
                      display="flex"
                      flexDirection="column"
                      gap="4px"
                      p={1}
                      bg="rgba(0,0,0,0.4)"
                      borderRadius="md"
                      {...getPilePosition(img)}
                      zIndex={1}
                    >

                    {pileCounts &&
                      Object.entries(pileCounts).map(([cardNum, count]) => {
                        const card = parseInt(cardNum);
                        const imageSrc = CardNumberToImage[card];
                        const label = CardNumberToString[card];

                        return (
                        <Box
                          key={`pile-${i}-${card}`}
                          display="flex"
                          alignItems="center"
                          gap="6px"
                        >
                        <Image
                          src={imageSrc}
                          alt={label}
                          height="30px"  
                          objectFit="contain" // maintain aspect ratio
                        />
                          <Text fontSize="sm" color="white" whiteSpace="nowrap">
                            ×{count}
                          </Text>
                        </Box>

                        );
                      })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default GameBoard;
