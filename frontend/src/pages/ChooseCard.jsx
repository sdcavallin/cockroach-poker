import { Box, Button, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ChooseCardPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)'); // Detect desktop screens
  const [cards, setCards] = useState([]); // Store player's hand (cards)

  useEffect(() => {
    const fetchPlayerHand = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players'); // Replace with actual player ID later
        if (response.data.success) {
          setCards(response.data.data.hand); // Only use hand data
        }
      } catch (error) {
        console.error('Error fetching player hand:', error);
      }
    };

    fetchPlayerHand();
  }, []);

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
      {/* Main Content Box */}
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
        {/* Title */}
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

        {/* Scrollable Cards Section */}
        <Box width='100%' height='50%' overflowY='auto' p='5%'>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <Button
                as={Link}
                to='/choosestatement'
                key={index}
                width='100%'
                height='12%'
                bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
                borderRadius='md'
                mb='3%'
                fontSize={{ base: '4vw', md: '3vw', lg: '20px' }}
                fontWeight='bold'
                _hover={{ bg: '#2A9D8F' }}
                onClick={() => alert(`You selected Card ${card}`)}
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
