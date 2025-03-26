import { Box, Text, Image, useMediaQuery } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connect to the backend socket
const socket = io('http://localhost:5000', { autoConnect: false });

// Avatar data
const avatars = [
  { name: 'bird', src: '/avatars/bird.png' },
  { name: 'black cat', src: '/avatars/black_cat.png' },
  { name: 'crab', src: '/avatars/crab.png' },
  { name: 'dog', src: '/avatars/dog.png' },
  { name: 'snake', src: '/avatars/snake.png' },
  { name: 'tabby cat', src: '/avatars/tabby_cat.png' },
];

const ChooseAvatarPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)'); // Detect desktop
  const [selectedAvatar, setSelectedAvatar] = useState(null); // Track selected avatar
  const playerId = 'PLAYER_UUID_HERE'; // Replace with player ID when that part is done

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle avatar click & send to backend
  const handleAvatarClick = (avatarName) => {
    setSelectedAvatar(avatarName);
    console.log(`Selected Avatar: ${avatarName}`);

    // Send selected avatar to the backend socket
    socket.emit('selectAvatar', { playerId, avatar: avatarName });
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
        width={{ base: '70%', md: '60%', lg: '70%', xl: '70%' }}
        height={{ base: '80%', md: '75%', lg: '80%', xl: '90%' }}
        borderRadius='md'
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
          bg='#f4f1de'
          p='3%'
          borderRadius='md'
          boxShadow='md'
          color='#264653'
          width='80%'
        >
          Choose an Avatar
        </Text>

        {/* Avatar Selection Grid */}
        <Box
          display='grid'
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} // 3 columns on larger screens
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

        {/* Display Selected Avatar */}
        {selectedAvatar && (
          <Text fontSize='xl' fontWeight='bold' color='gray.700' mt='5%'>
            Selected: {selectedAvatar}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ChooseAvatarPage;
