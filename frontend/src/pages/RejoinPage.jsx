import { Box, Button, Text, Input, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { autoConnect: false });

const RejoinPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [roomCode, setRoomCode] = useState('');
  const [uuid, setUUID] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleRejoin = () => {
    if (!roomCode.trim() || !uuid.trim()) {
      toast({
        title: 'Missing Info',
        description: 'Please enter both a room code and your UUID.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const storedAvatar = Cookies.get('avatar') || 'baby-yoda';

    Cookies.set('roomCode', roomCode.trim(), { expires: 2 });
    Cookies.set('uuid', uuid.trim(), { expires: 2 });
    Cookies.set('avatar', storedAvatar, { expires: 2 });

    socket.emit('selectAvatar', {
      playerId: uuid.trim(),
      avatar: storedAvatar,
    });

    navigate('/choosecard', {
      state: {
        uuid: uuid.trim(),
        roomCode: roomCode.trim().toUpperCase(),
      },
    });
  };

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
        <Text fontSize='3xl' fontWeight='bold' color='#264653' mb='4'>
          You got disconnected! Let's get you back in.
        </Text>

        <Text fontSize='md' color='#264653' mb='2'>
          Socket status: {message}
        </Text>

        <Input
          placeholder='Enter Room Code'
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          textAlign='center'
          fontSize='lg'
          width='80%'
          border='2px solid #2A9D8F'
          bg='#f4f1de'
          mb='4'
        />

        <Input
          placeholder='Enter Your UUID'
          value={uuid}
          onChange={(e) => setUUID(e.target.value)}
          textAlign='center'
          fontSize='lg'
          width='80%'
          border='2px solid #2A9D8F'
          bg='#f4f1de'
          mb='6'
        />

        <Button
          colorScheme='teal'
          size='lg'
          fontSize='xl'
          onClick={handleRejoin}
        >
          Rejoin Game
        </Button>
      </Box>
    </Box>
  );
};

export default RejoinPage;
