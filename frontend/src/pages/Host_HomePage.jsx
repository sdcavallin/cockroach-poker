import { useEffect, useState } from 'react';
import { Box, Text, Grid, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import FlippingCard from './FlippingCard.jsx';

const StartBoard = () => {
  const [players, setNumPlayers] = useState([]); // Array of player objects from backend
  const [loading, setIsLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for fetching data

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:5000/players'); // API key here I think
        const data = await response.json();

        if (data.success) {
          setNumPlayers(data.players);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();

    const interval = setInterval(fetchPlayers, 5000);

    return () => clearInterval(interval);
  }, []);

  const playerCount = players.length;

  return (
    <Box // Add Box as a wrapper with background color
      bg='#2A9D8F' // Set background color here
      width='100vw'
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={['5%', '8%']}
    >
      {/* Cockroach Poker Title */}
      <Text
        position='relative'
        top={{ base: '2%', md: '1%' }}
        left={{ base: '3%', md: '5%' }}
        fontSize={{ base: '6vw', md: '4vw' }}
        color='#264653'
        fontWeight='bold'
      >
        Cockroach Poker
      </Text>

      {/* Start Game Button */}
      <Button
        as={Link}
        to='/gameboard'
        width={{ base: '70%', md: '20%' }}
        bg='#E9C46A'
        color='#264653'
        fontSize={{ base: '4vw', md: '3vw' }}
        position='relative'
        bottom='10%'
        left='50%'
        transform='translateX(-50%)'
        _hover={{ bg: '#E76F51' }}
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
      >
        room code: SKD33
      </Text>

      {/* Bottom Cards - Flips based on player count */}
      <Grid
        templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }}
        gap={{ base: '2%', md: '5%' }}
        width={{ base: '90%', md: '90%' }}
        justifyItems='center' // Ensure the cards are centered
      >
        {[...Array(5)].map((_, index) => (
          <FlippingCard
            key={index}
            frontColor='#E9C46A'
            backColor='#F4A261'
            isFlipped={index < playerCount} // Flip based on player count
          />
        ))}
      </Grid>

      {/* Side Cards - Flips based on player count */}
      <Grid
        templateRows='repeat(4, 1fr)'
        gap={{ base: '2%', md: '3%' }}
        width={{ base: '90%', md: '90%' }}
        justifyItems='center' // Ensure the cards are centered
        height={{ base: '20%', md: '25%' }}
      >
        {[...Array(4)].map((_, index) => (
          <FlippingCard
            key={index + 5} // Ensure unique keys
            frontColor={index === 3 ? '#a3b18a' : '#F4A261'}
            backColor={index % 2 === 0 ? '#E9C46A' : '#F4A261'}
            isFlipped={index + 5 < playerCount} // Flip based on player count
          />
        ))}
      </Grid>
    </Box>
  );
};

export default StartBoard;
