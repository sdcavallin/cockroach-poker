import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Grid,
  Button,
  Container,
  Image,
} from '@chakra-ui/react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import FlippingCard from '../components/FlippingCard.jsx';
import { io } from 'socket.io-client';
import AudioPlayer from '../components/AudioPlayer.jsx';

const socket = io('http://localhost:5000', { autoConnect: false });

const HostPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [gameRoom, setGameRoom] = useState(null);
  const [flippedStates, setFlippedStates] = useState([false, false, false, false, false, false]);
  const location = useLocation();
  const { roomCode } = location.state || {};
  const navigate = useNavigate();

  const glowAnimation = `
    @keyframes glow {
      0%, 100% {
        text-shadow: none;
        opacity: 0.7;
      }
      50% {
        text-shadow:
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 17px #FBC02D,
          0 0 19px #FBC02D,
          0 0 21px #FBC02D,
          0 0 23px #FBC02D,
          0 0 25px #FBC02D;
        opacity: 1;
      }
    }
  `;

  const handleJoinRoom = (roomCode) => {
    socket.emit('joinSocketRoom', roomCode);
  };

  const handleStartGame = () => {
    socket.emit('requestStartGame', roomCode);
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      setMessage(`Connected with id ${socket.id}`);
      if (roomCode) handleJoinRoom(roomCode);
    });

    socket.on('returnGameRoom', (room) => {
      setGameRoom(room);
    });

    socket.on('returnStartGame', (roomCode) => {
      navigate('/game', { state: { roomCode } });
    });

    return () => {
      socket.off('connect');
      socket.off('returnGameRoom');
      socket.off('returnStartGame');
    };
  }, [roomCode]);

  useEffect(() => {
    const players = gameRoom?.players || [];
    const playerCount = players.length;
    if (playerCount > 0 && playerCount <= 6) {
      setTimeout(() => {
        setFlippedStates((prev) => {
          const newStates = [...prev];
          newStates[playerCount - 1] = true;
          return newStates;
        });
      }, 300);
    }
  }, [gameRoom?.players?.length]);

  const renderCards = (startIndex) =>
    [...Array(3)].map((_, i) => {
      const player = gameRoom?.players[startIndex + i];
      const flipped = flippedStates[startIndex + i];
      return (
        <FlippingCard
          key={startIndex + i}
          isFlipped={flipped}
          width='10vw'
          height='15vw'
          backImage='/cards/back.png'
          frontContent={
            player ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="100%"  
          >
            <Image
              src={`/avatars/${player.playerIcon}.png`}
              alt={player.nickname}
              width="100%"
              borderRadius="full"
              mb={2}
            />
            <Text fontWeight="bold" fontSize="sm">
              {player.nickname}
            </Text>
          </Box>

            ) : null
          }
        />
      );
    });

  return (
    <>
      {roomCode ? (
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
          <AudioPlayer filePath={'music/FunkInTheTrunk.mp3'} />
          <Grid templateColumns='repeat(3, 1fr)' gap='4' mt='4' justifyItems='center' width='80%'>
            {renderCards(0)}
          </Grid>

          <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' height='30%' mt={4}>
            <Text fontSize={{ base: '6vw', md: '4vw', lg: '5vw' }} color='#264653' fontWeight='bold' mb={4}>
              <Text as='span'>🔗</Text>
              <style>{glowAnimation}</style>
              <Text as='span' textDecoration='underline' sx={{ animation: `glow 5s ease-in-out infinite` }}>
                cockroach.poker
              </Text>
            </Text>

            <Button
              onClick={handleStartGame}
              bg='#E9C46A'
              color='#264653'
              fontSize={{ base: '4vw', md: '2vw' }}
              _hover={{ bg: '#E76F51' }}
              px='6'
              py='7'
              mb={4}
              disabled={(gameRoom?.numPlayers ?? 0) < 2}
            >
              Start Game ({gameRoom?.numPlayers ?? 0} players)
            </Button>

            <Text fontSize={{ base: '5vw', md: '2.2vw' }} color='#264653' fontWeight='bold'>
              Room Code:{' '}
              <Text as='span' color='#FBC02D' textShadow='0 0 1px #264653, 0 0 3px #000000, 0 0 15px #264653;'>
                {roomCode || 'N/A'}
              </Text>
            </Text>
          </Box>

          <Grid templateColumns='repeat(3, 1fr)' gap='4' mb='4' justifyItems='center' width='80%'>
            {renderCards(3)}
          </Grid>
        </Container>
      ) : (
        <Navigate to='/'  />
      )}
    </>
  );
};

export default HostPage;
