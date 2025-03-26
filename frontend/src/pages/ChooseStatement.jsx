import { Box, Button, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ChooseStatementPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)'); // Detect desktop screens

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A' // Background color
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={{ base: '5%', md: '3%' }} // Adjust padding for different screen sizes
    >
      {/* Main Content Box */}
      <Box
        width={{ base: '90%', md: '70%', lg: '50%', xl: '40%' }} // Prevent extreme stretching
        height={{ base: '80%', md: '75%', lg: '70%' }}
        bg='#F4A261'
        border='2px solid #2A9D8F'
        borderRadius='md'
        boxShadow='xl'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='space-between'
        p='5%' // Consistent spacing
        maxW='500px' // Prevents excessive width on desktops
      >
        {/* Title */}
        <Text
          fontSize={{ base: '6vw', md: '4vw', lg: '28px' }} // Adjust font size for large screens
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='3%'
          borderRadius='md'
          boxShadow='md'
          color='#264653'
          width='80%'
        >
          Choose a Statement
        </Text>

        {/* "This is a..." Text */}
        <Text
          fontSize={{ base: '4.5vw', md: '3.5vw', lg: '22px' }}
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='3%'
          borderRadius='md'
          color='#264653'
          width='60%'
        >
          This is a...
        </Text>

        {/* Scrollable Cards Section */}
        <Box
          width='100%'
          height='50%'
          overflowY='auto' // Prevents extreme scrolling
          p='5%'
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Button
              as={Link}
              to='/choosecard'
              key={index}
              width='100%' // Full width
              height='12%' // Increase button height for better visibility
              bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
              borderRadius='md'
              mb='3%'
              fontSize={{ base: '4vw', md: '3vw', lg: '20px' }} // Scale font size properly
              fontWeight='bold'
              _hover={{ bg: '#2A9D8F' }}
              onClick={() => alert(`You selected Card ${index + 1}`)}
            >
              Card {index + 1}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChooseStatementPage;
