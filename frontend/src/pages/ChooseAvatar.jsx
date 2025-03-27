import { Box, Text, Image, useMediaQuery, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000', { autoConnect: false });

const avatars = [
  { name: 'bird', src: '/avatars/bird.png' },
  { name: 'black cat', src: '/avatars/black_cat.png' },
  { name: 'crab', src: '/avatars/crab.png' },
  { name: 'dog', src: '/avatars/dog.png' },
  { name: 'snake', src: '/avatars/snake.png' },
  { name: 'tabby cat', src: '/avatars/tabby_cat.png' },
];

const ChooseAvatarPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const playerId = Cookies.get('player_uuid');
  const navigate = useNavigate(); // useNavigate hook from react-router-dom
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAvatarClick = (avatarName) => {
    setSelectedAvatar(avatarName);
    console.log(`Selected Avatar: ${avatarName}`);

    if (playerId) {
      socket.emit('selectAvatar', { playerId, avatar: avatarName });
    } else {
      console.warn('Player UUID not found in cookies!');
    }
  };

  const handleNext = () => {
    if (!selectedAvatar) {
      alert('Please select an avatar first!');
      return;
    }

    console.log('Navigating with UUID:', playerId);
    console.log('Room Code:', 'SKD33');

    if (!playerId) {
      alert('Missing player ID — please rejoin the game.');
      return;
    }

    Cookies.set('room_code', 'SKD33', { expires: 2 });

    navigate('/choosecard', {
      state: {
        uuid: playerId,
        roomCode: 'SKD33',
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
      flexDirection='column'
      overflow='hidden'
      p={{ base: '5%', md: '3%' }}
    >
      <Box
        width={{ base: '70%', md: '60%', lg: '70%', xl: '70%' }}
        height='auto'
        borderRadius='md'
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
          bg='#f4f1de'
          p='3%'
          borderRadius='md'
          boxShadow='md'
          color='#264653'
          width='80%'
        >
          Choose an Avatar
        </Text>

        <Box
          display='grid'
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap='5%'
          mt='5%'
        >
          {avatars.map((avatar) => (
            <Box key={avatar.name} textAlign='center'>
              <Image
                src={avatar.src}
                alt={avatar.name}
                width={{ base: '50%', md: '40%', lg: '30%' }}
                cursor='pointer'
                _hover={{
                  transform: 'scale(1.1)',
                  transition: '0.3s ease-in-out',
                }}
                onClick={() => handleAvatarClick(avatar.name)}
              />
              <Text fontSize='lg' fontWeight='bold' color='#264653'>
                {avatar.name}
              </Text>
            </Box>
          ))}
        </Box>

        {selectedAvatar && (
          <Text fontSize='xl' fontWeight='bold' color='gray.700' mt='5%'>
            Selected: {selectedAvatar}
          </Text>
        )}
        <Button
          mt='6%'
          bg='#2A9D8F'
          color='white'
          fontSize='lg'
          width='60%'
          _hover={{ bg: '#21867a' }}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ChooseAvatarPage;
