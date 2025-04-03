import {
  Box,
  Button,
  Text,
  Input,
  Image,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { autoConnect: false });

const avatars = [
  { name: 'baby-yoda', src: '/avatars/baby-yoda.png' },
  { name: 'bmo', src: '/avatars/bmo.png' },
  { name: 'cookie-monster', src: '/avatars/cookie-monster.png' },
  { name: 'finn', src: '/avatars/finn.png' },
  { name: 'genie-lamp', src: '/avatars/genie-lamp.png' },
  { name: 'jake', src: '/avatars/jake.png' },
  { name: 'mermaid', src: '/avatars/mermaid.png' },
  { name: 'navi-avatar', src: '/avatars/navi-avatar.png' },
  { name: 'wonder-woman', src: '/avatars/wonder-woman.png' },
];

const PlayerInit = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)');
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const generateUUID = () => {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5 digit random uuid
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleReturnJoinPlayerToRoom = (success, returnedRoomCode, uuid) => {
      if (success) {
        Cookies.set('roomCode', returnedRoomCode, { expires: 2 });
        Cookies.set('uuid', uuid, { expires: 2 }); // ✅ This comes from the server
        Cookies.set('avatar', selectedAvatar, { expires: 2 });

        navigate('/dummyplay', {
          state: {
            uuid: uuid,
            roomCode: returnedRoomCode,
          },
        });
      } else {
        toast({
          title: 'Join Failed',
          description: 'Could not join room. Try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    socket.on('returnJoinPlayerToRoom', handleReturnJoinPlayerToRoom);
    return () => {
      socket.off('returnJoinPlayerToRoom', handleReturnJoinPlayerToRoom);
    };
  }, [selectedAvatar, navigate, toast]);
  const handleAvatarClick = (avatarName) => {
    setSelectedAvatar(avatarName);
  };

  const handleNext = () => {
    if (!roomCode.trim() || !nickname.trim() || !selectedAvatar) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields and select an avatar!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    socket.emit(
      'requestJoinPlayerToRoom',
      roomCode.trim().toUpperCase(),
      nickname.trim(),
      selectedAvatar,
      socket.id
    );
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
      >
        <Text fontSize='2xl' fontWeight='bold' color='#264653' mb='4'>
          Join the Game
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
          placeholder='Enter Nickname'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          textAlign='center'
          fontSize='lg'
          width='80%'
          border='2px solid #2A9D8F'
          bg='#f4f1de'
          mb='6'
        />

        <Text fontSize='lg' fontWeight='bold' color='#264653' mb='3'>
          Choose an Avatar
        </Text>

        <Box
          display='grid'
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap='4'
          mb='5'
        >
          {avatars.map((avatar) => (
            <Box key={avatar.name} textAlign='center'>
              <Image
                src={avatar.src}
                width={{ base: '60px', md: '80px' }}
                cursor='pointer'
                border={
                  selectedAvatar === avatar.name ? '3px solid #2A9D8F' : 'none'
                }
                borderRadius='full'
                _hover={{
                  transform: 'scale(1.1)',
                  transition: '0.3s ease-in-out',
                }}
                onClick={() => handleAvatarClick(avatar.name)}
              />
            </Box>
          ))}
        </Box>

        {selectedAvatar && (
          <Text fontSize='md' color='gray.700' mb='3'>
            Selected: {selectedAvatar}
          </Text>
        )}

        <Button
          colorScheme='teal'
          width='60%'
          fontSize='lg'
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PlayerInit;
