import {
  Box,
  Button,
  Text,
  Input,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const JoinRoom = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)'); // Detect desktop screens
  const [username, setUsername] = useState(''); // Track username input
  const navigate = useNavigate(); // Navigation for next step

  const handleNext = () => {
    if (username.trim() === '') {
      alert('Please enter a room code!');
      return;
    }

    Cookies.set('room_code', username.trim(), { expires: 2 });

    console.log(`Room code selected: ${username}`);
    navigate('/chooseuname');
  };

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
        height={{ base: '50%', md: '45%', lg: '40%' }}
        bg='#F4A261'
        border='2px solid #2A9D8F'
        borderRadius='md'
        boxShadow='xl'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        p='5%'
      >
        {/* Title */}
        <Text
          fontSize={{ base: '6vw', md: '4vw', lg: '28px' }}
          fontWeight='bold'
          textAlign='center'
          color='#264653'
          mb='5%'
        >
          Enter the Roomcode From Host Screen
        </Text>

        {/* Username Input Field */}
        <Input
          placeholder='Enter Room Code'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          textAlign='center'
          fontSize='lg'
          width='80%'
          border='2px solid #2A9D8F'
          borderRadius='md'
          bg='#f4f1de'
          mb='5%'
        />

        {/* Next Button */}
        <Button
          width='80%'
          bg='#E76F51'
          color='white'
          fontSize='lg'
          _hover={{ bg: '#D9534F' }}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default JoinRoom;
