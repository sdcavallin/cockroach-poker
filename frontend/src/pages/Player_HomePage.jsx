import { Box, Button, Text, Image, VStack, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#2A9D8F' // Background color
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={{ base: '5%', sm: '4%', md: '3%', lg: '2%', xl: '1%' }} // Adjust padding
    >
      <HStack
        spacing={{ base: '5%', sm: '4%', md: '3%', lg: '2%', xl: '1%' }} // Responsive spacing
        width={{ base: '90%', sm: '85%', md: '80%', lg: '75%', xl: '70%' }} // Responsive width
        height={{ base: '85%', sm: '80%', md: '75%', lg: '70%', xl: '65%' }} // Responsive height
        justifyContent='center'
        alignItems='center'
        flexDirection={{ base: 'column', md: 'row' }} // Switch to row for larger screens
      >
        {/* Title & Buttons */}
        <VStack
          spacing={{ base: '5%', sm: '4%', md: '3%', lg: '2%' }} // Responsive spacing
          alignItems='center'
          width={{ base: '80%', sm: '70%', md: '60%', lg: '50%', xl: '45%' }} // Responsive width
        >
          <Text
            fontSize={{
              base: '8vw',
              sm: '6vw',
              md: '4vw',
              lg: '3vw',
              xl: '2.5vw',
            }} // Responsive font size
            fontWeight='bold'
            textAlign='center'
            bg='#F4A261'
            p={{ base: '4%', sm: '3%', md: '2%', lg: '2%' }} // Responsive padding
            borderRadius='md'
            color='#264653'
            width='100%'
          >
            COCKROACH <br /> POKER
          </Text>
          <VStack
            spacing={{ base: '5%', sm: '6%', md: '7%', lg: '8%', xl: '9%' }} // Adjusts spacing based on screen size
            alignItems='center'
            width={{ base: '80%', sm: '70%', md: '60%', lg: '50%', xl: '45%' }}
          >
            <Button
              as={Link}
              to='/host'
              width={{
                base: '90%',
                sm: '85%',
                md: '80%',
                lg: '75%',
                xl: '70%',
              }}
              fontSize={{
                base: '5vw',
                sm: '4vw',
                md: '3vw',
                lg: '2.5vw',
                xl: '2vw',
              }}
            >
              CREATE
            </Button>
            <Button
              width={{
                base: '90%',
                sm: '85%',
                md: '80%',
                lg: '75%',
                xl: '70%',
              }}
              fontSize={{
                base: '5vw',
                sm: '4vw',
                md: '3vw',
                lg: '2.5vw',
                xl: '2vw',
              }}
            >
              JOIN
            </Button>
          </VStack>
        </VStack>

        {/* Cards Image */}
        <Image
          src='/images/cards.png'
          alt='Cards'
          width={{ base: '50%', sm: '40%', md: '30%', lg: '25%', xl: '20%' }} // Responsive image width
          transform={{ base: 'rotate(15deg)', md: 'rotate(20deg)' }} // Adjust rotation for larger screens
        />
      </HStack>
    </Box>
  );
};

export default LandingPage;
