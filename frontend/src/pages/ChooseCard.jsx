import { Box, Button, Text, useMediaQuery, Grid } from '@chakra-ui/react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../socket';
import Cookies from 'js-cookie';

const ChooseCardPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)');
  const [cards, setCards] = useState([]);
  const [playerUUID, setPlayerUUID] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const location = useLocation();
  const state = location.state || {};

  const finalUUID = state.uuid || Cookies.get('player_uuid');
  const finalRoomCode = state.roomCode || Cookies.get('room_code') || '123B';

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
  }, [state]);

  if (playerUUID === null) return <Text>Loading...</Text>;
  if (!playerUUID) return <Navigate to='/dummyjoin' replace />;

  const renderCardButton = (card, index) => (
    <Button
      as={Link}
      to='/choosestatement'
      state={{ selectedCard: card, uuid: playerUUID, roomCode }}
      key={index}
      width='100%'
      height='100%'
      bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
      borderRadius='md'
      fontSize={{ base: '4vw', md: '3vw', lg: '20px' }}
      fontWeight='bold'
      _hover={{ bg: '#2A9D8F' }}
    >
      Card {card}
    </Button>
  );

  const MobileLayout = () => (
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
        <Text fontSize='2xl' fontWeight='bold' color='#264653'>
          Choose a Card
        </Text>
        <Box width='100%' height='50%' overflowY='auto' p='5%'>
          {cards.length > 0 ? (
            cards.map(renderCardButton)
          ) : (
            <Text fontSize='xl' fontWeight='bold' color='gray.700'>
              Loading cards...
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );

  const DesktopLayout = () => (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      p={10}
    >
      <Text fontSize='4xl' fontWeight='bold' color='#264653' mb={8}>
        Choose a Card
      </Text>
      <Grid templateColumns='repeat(3, 1fr)' gap={6} width='60%' maxW='800px'>
        {cards.length > 0 ? (
          cards.map(renderCardButton)
        ) : (
          <Text fontSize='xl' fontWeight='bold' color='gray.700'>
            Loading cards...
          </Text>
        )}
      </Grid>
    </Box>
  );

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
};

export default ChooseCardPage;
