import { Box, Button, Text, Input, useToast, Heading } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const RejoinHost = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('123B');
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleJoin = () => {
    if (!roomCode.trim()) {
      toast({
        title: 'Missing Info',
        description: 'Please enter a room code to rejoin',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    navigate('/host', {
      state: {
        roomCode: roomCode,
      },
    });
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  useEffect(() => {
    if (location.state && location.state.roomCode) {
      setUUID(location.state.roomCode);
    }
  }, [location]);

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A'
      display='flex'
      justifyContent='center'
      alignItems='center'
      p='5%'
    >
      <Box
        width={{ base: '90%', md: '70%', lg: '50%', xl: '40%' }}
        bg='#F4A261'
        border='2px solid #2A9D8F'
        borderRadius='md'
        boxShadow='xl'
        p='5%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        textAlign={'center'}
      >
        <Heading size='lg' fontWeight='bold' color='#264653' mb='4'>
          Rejoin an Ongoing Game
        </Heading>

        <Text fontSize='md' color='#264653' mb='2'>
          Socket status: {message}
        </Text>

        <Text
          fontSize='md'
          fontWeight='bold'
          color='#264653'
          alignSelf='flex-start'
          ml='10%'
          mb='1'
        >
          Room Code:
        </Text>
        <Input
          placeholder='Enter Room Code'
          value={roomCode}
          onChange={handleRoomCodeChange}
          textAlign='center'
          fontSize='lg'
          width='80%'
          border='2px solid #2A9D8F'
          bg='#f4f1de'
          mb='4'
        />

        <Button colorScheme='teal' size='lg' fontSize='xl' onClick={handleJoin}>
          Join Game
        </Button>
      </Box>
    </Box>
  );
};

export default RejoinHost;
