import { Box, Button, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../socket'; // import your shared socket instance
import Cookies from 'js-cookie';

const ChooseCardPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)');
  const [cards, setCards] = useState([]);
  const [playerUUID, setPlayerUUID] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const location = useLocation();
  const state = location.state || {};
  const uuidFromState = state.uuid;
  const uuidFromCookie = Cookies.get('player_uuid');
  const finalUUID = uuidFromState || uuidFromCookie;

  const roomCodeFromState = state.roomCode;
  const roomCodeFromCookie = Cookies.get('room_code');
  const finalRoomCode = roomCodeFromState || roomCodeFromCookie || '123B';

  console.log('Arrived at ChooseCardPage');
  console.log('Cookies.get("player_uuid"):', Cookies.get('player_uuid'));
  console.log('Cookies.get("room_code"):', Cookies.get('room_code'));
  console.log('state:', state);
  console.log('finalUUID:', finalUUID);

  useEffect(() => {
    if (!finalUUID || !finalRoomCode) return;

    Cookies.set('player_uuid', finalUUID, { expires: 2 });
    Cookies.set('room_code', finalRoomCode, { expires: 2 });

    setPlayerUUID(finalUUID);
    setRoomCode(finalRoomCode);

    socket.emit('getPlayer', finalRoomCode, finalUUID);

    const handleReturnPlayer = (player) => {
      setCards(player.hand);
    };

    socket.on('returnPlayer', handleReturnPlayer);

    return () => {
      socket.off('returnPlayer', handleReturnPlayer);
    };
  }, [finalUUID, finalRoomCode]);

  // If we don't have a UUID, redirect to join
  if (playerUUID === null) {
    return <Text>Loading...</Text>; // wait for effect to populate
  }
  if (!playerUUID) {
    return <Navigate to='/dummyjoin' replace />;
  }

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={{ base: '5%', md: '3%' }}
    >
      <Box
        width={{ base: '90%', md: '70%', lg: '50%', xl: '40%' }}
        height={{ base: '80%', md: '75%', lg: '70%' }}
        bg='#F4A261'
        border='2px solid #2A9D8F'
        borderRadius='md'
        boxShadow='xl'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='space-between'
        p='5%'
        maxW='500px'
      >
        <Text
          fontSize={{ base: '6vw', md: '4vw', lg: '28px' }}
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='3%'
          borderRadius='md'
          boxShadow='md'
          color='#264653'
          width='80%'
        >
          Choose a Card
        </Text>

        <Box width='100%' height='50%' overflowY='auto' p='5%'>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <Button
                as={Link}
                to='/choosestatement'
                state={{ selectedCard: card, uuid: playerUUID, roomCode }}
                key={index}
                width='100%'
                height='12%'
                bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
                borderRadius='md'
                mb='3%'
                fontSize={{ base: '4vw', md: '3vw', lg: '20px' }}
                fontWeight='bold'
                _hover={{ bg: '#2A9D8F' }}
              >
                Card {card}
              </Button>
            ))
          ) : (
            <Text fontSize='xl' fontWeight='bold' color='gray.700'>
              Loading cards...
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseCardPage;
