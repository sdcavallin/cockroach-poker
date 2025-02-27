import { Box, Button, Text, Image, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@chakra-ui/react';

const LandingPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)'); // Switch at 768px

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#2A9D8F' // teal background for the landing page
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='visible'
    >
      {isDesktop ? (
        // Big Layout for Desktop
        <HStack
          spacing='5%'
          width='80%' // Adjusting width percentage
          height='80%' // Adjusting height percentage
          justifyContent='center'
          alignItems='center'
        >
          {/* Cards Image on Desktop */}
          <Image
            src='/images/cards.png'
            alt='Cards'
            width='15%' 
            transform='rotate(20deg)'
            position='relative'
            left='10%'
          />
        </HStack>
      ) : (
        // Small Layout for Mobile
        <VStack spacing='10%'>
          {/* Title */}
          <Text
            fontSize='8vw' 
            fontWeight='bold'
            textAlign='center'
            bg='#F4A261'
            p='5%' 
            borderRadius='md'
            color='#264653'
          >
            COCKROACH <br /> POKER
          </Text>

          {/* Create & Join Buttons */}
          <Button
            as={Link}
            to='/host'
            width='90%' 
            fontSize='5vw' 
          >
            CREATE
          </Button>
          <Button width='90%' fontSize='5vw'>
            JOIN
          </Button>

          {/* Cards Image on Mobile */}
          <Image
            src='/images/cards.png'
            alt='Cards'
            width='40%' 
          />
        </VStack>
      )}
    </Box>
  );
};

export default LandingPage;
