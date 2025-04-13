import { Box, Button, Text, useMediaQuery, Grid } from '@chakra-ui/react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import socket from '../socket';
import Cookies from 'js-cookie';

const ChooseCardPage = () => {
  const location = useLocation();

  // Extract values from location.state
  const { uuid: finalUUID, roomCode: finalRoomCode } = location.state || {};

  // Check if values exist
  if (!finalUUID || !finalRoomCode) {
    return <Navigate to='/' replace />;
  }

  const [isDesktop] = useMediaQuery('(min-width: 1024px)');
  const [cards, setCards] = useState([]);

  // Save UUID to cookie
  useEffect(() => {
    Cookies.set('player_uuid', finalUUID, { expires: 2 });
  }, [finalUUID]);

  // Connect to socket and fetch player
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit('getPlayer', finalRoomCode, finalUUID);

    const handleReturnPlayer = (player) => {
      if (!player) {
        console.warn(
          `Player not found for UUID: ${finalUUID} in Room: ${finalRoomCode}`
        );
        return;
      }
      console.log('Player received:', player);
      setCards(player.hand);
    };

    socket.on('returnPlayer', handleReturnPlayer);

    return () => {
      socket.off('returnPlayer', handleReturnPlayer);
    };
  }, [finalUUID, finalRoomCode]);

  const renderCardButton = (card, index) => (
    <Button
      as={Link}
      to='/choosestatement'
      state={{ selectedCard: card, uuid: finalUUID, roomCode: finalRoomCode }}
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
      p={6}
    >
      <Text fontSize='2xl' fontWeight='bold' color='#264653' mb={4}>
        Choose a Card
      </Text>
      <Box width='100%' maxW='400px' height='50%' overflowY='auto' p={4}>
        {cards.length > 0 ? (
          cards.map(renderCardButton)
        ) : (
          <Text>Loading cards...</Text>
        )}
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
          <Text>Loading cards...</Text>
        )}
      </Grid>
    </Box>
  );

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
};

export default ChooseCardPage;
