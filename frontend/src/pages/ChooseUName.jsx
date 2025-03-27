import { Box, Button, Text, Input, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Optional: to store UUID

const ChooseUName = () => {
  const [isDesktop] = useMediaQuery('(min-width: 1024px)');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleNext = async () => {
    if (username.trim() === '') {
      alert('Please enter a username!');
      return;
    }

    try {
      console.log('Sending request with username:', username.trim());

      const response = await axios.get(
        'http://localhost:5000/api/players/uuid/lookup',
        {
          params: { username: username.trim() },
        }
      );

      console.log('Received response:', response.data);

      if (response.data.success && response.data.uuid) {
        Cookies.set('player_uuid', response.data.uuid, { expires: 2 });
        navigate('/chooseavatar');
      } else {
        alert('Username not found!');
      }
    } catch (error) {
      console.error('Caught error:', error);
      console.error('Error response:', error.response); // 👈 this is KEY
      alert('Server error while looking up username.');
    }
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
        <Text
          fontSize={{ base: '6vw', md: '4vw', lg: '28px' }}
          fontWeight='bold'
          textAlign='center'
          color='#264653'
          mb='5%'
        >
          Enter Your Username
        </Text>

        <Input
          placeholder='Type your username...'
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

export default ChooseUName;
