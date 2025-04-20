import { Box, Text, Container, Image } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const socket = io('http://localhost:5000', { autoConnect: false });

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px 4px rgba(233, 196, 106, 0.6); }
  50% { box-shadow: 0 0 20px 10px rgba(233, 196, 106, 1); }
  100% { box-shadow: 0 0 10px 4px rgba(233, 196, 106, 0.6); }
`;

const CardNumberToImage = {
  0: '/cards/rat.png',
  1: '/cards/fly.png',
  2: '/cards/roach.png',
  3: '/cards/spider.png',
  4: '/cards/bat.png',
  5: '/cards/stinkbug.png',
  6: '/cards/frog.png',
  7: '/cards/scorpion.png',
};

const getPilePosition = (position, index) => {
  const base = {};

  // Top left
  if (position.top === '5%' && position.left === '5%') {
    return { top: '10%', left: '15%' };
  }
  // Top right
  if (position.top === '5%' && position.right === '5%') {
    return { top: '10%', right: '15%' };
  }
  // Bottom left
  if (position.bottom === '5%' && position.left === '5%') {
    return { bottom: '10%', left: '15%' };
  }
  // Bottom right
  if (position.bottom === '5%' && position.right === '5%') {
    return { bottom: '10%', right: '15%' };
  }
  // Top center
  if (position.top === '5%' && position.left === '50%') {
    return {
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      flexDirection: 'row',
    };
  }
  // Bottom center
  if (position.bottom === '5%' && position.left === '50%') {
    return {
      bottom: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      flexDirection: 'row',
    };
  }

  return base;
};

const images = [
  { src: 'avatars/bmo.png', right: '5%', bottom: '5%' },
  { src: 'avatars/finn.png', right: '5%', top: '5%' },
  { src: 'avatars/navi-avatar.png', left: '5%', top: '5%' },
  { src: 'avatars/harry-potter.png', left: '5%', bottom: '5%' },
  {
    src: 'avatars/jake.png',
    left: '50%',
    top: '0%',
    transform: 'translateX(-50%)',
  },
  {
    src: 'avatars/wonder-woman.png',
    left: '50%',
    bottom: '0%',
    transform: 'translateX(-50%)',
  },
];

const CardNumberToString = {
  0: 'Rat',
  1: 'Fly',
  2: 'Cockroach',
  3: 'Spider',
  4: 'Bat',
  5: 'Stinkbug',
  6: 'Toad',
  7: 'Scorpion',
};

const avatarMap = {
  'baby-yoda': '/avatars/baby-yoda.png',
  bmo: '/avatars/bmo.png',
  'cookie-monster': '/avatars/cookie-monster.png',
  finn: '/avatars/finn.png',
  'genie-lamp': '/avatars/genie-lamp.png',
  'harry-potter': '/avatars/harry-potter.png',
  jake: '/avatars/jake.png',
  mermaid: '/avatars/mermaid.png',
  'navi-avatar': '/avatars/navi-avatar.png',
  'wonder-woman': '/avatars/wonder-woman.png',
};

const GamePage = () => {
  const location = useLocation();
  const { roomCode } = location.state || {};
  const [turnPlayerId, setTurnPlayerId] = useState(null);

  const [gameRoom, setGameRoom] = useState(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log(`Connected with id ${socket.id}`);
    });

    socket.on('returnGameRoom', (room) => {
      console.log('Received returnGameRoom', room);
      setGameRoom(room);
    });

    return () => {
      socket.off('connect');
      socket.off('returnGameRoom');
    };
  }, []);

  useEffect(() => {
    if (roomCode) {
      socket.emit('requestGameRoom', roomCode);
    }
  }, [roomCode]);

  useEffect(() => {
    socket.on('turnPlayerUpdated', (uuid) => {
      setTurnPlayerId(uuid);
    });

    return () => {
      socket.off('turnPlayerUpdated');
    };
  }, []);

  const visibleImages = images.slice(
    0,
    gameRoom ? Math.min(gameRoom.players.length, 6) : 0
  );

  return (
    <Container
      maxW='100vw'
      maxH='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
      bg='#2A9D8F'
      p={0}
      flexDirection='column'
    >
      {gameRoom && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100vh'
          bg='#E9C46A'
          p={4}
          position='relative'
          width='100%'
        >
          <Box
            width='90%'
            height='90%'
            bg='#F4A261'
            p={4}
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            position='relative'
            borderRadius='md'
          >
            <Text
              position='absolute'
              top='4'
              fontSize='xl'
              fontWeight='bold'
              color='#264653'
            >
              Room Code: {roomCode} <br />
              Turn player: {gameRoom?.currentAction?.turnPlayer.nickname}{' '}
              {/* TODO: Delete this and show in a cooler way */}
            </Text>

            <Text
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
              fontSize={['30px', '40px', '50px']}
              fontWeight='bold'
              color='#264653'
              textAlign='center'
              opacity={0.2}
            >
              🔗cockroach.poker
            </Text>

            {gameRoom.players.map((player, index) => {
              const pileCounts = player?.pile?.reduce((acc, card) => {
                acc[card] = (acc[card] || 0) + 1;
                return acc;
              }, {});

              const positions = [
                { top: '5%', left: '5%' },
                { top: '5%', right: '5%' },
                { bottom: '5%', left: '5%' },
                { bottom: '5%', right: '5%' },
                { top: '5%', left: '50%', transform: 'translateX(-50%)' },
                { bottom: '5%', left: '50%', transform: 'translateX(-50%)' },
              ];

              const avatarSrc =
                avatarMap[player.playerIcon] || '/avatars/default.png';

              const isInConspiracy =
                gameRoom?.currentAction?.conspiracy?.includes(player.uuid);

              return (
                <Box key={`player-${index}`}>
                  <Box
                    position='absolute'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    zIndex={2}
                    {...positions[index % positions.length]}
                  >
                    <Image
                      src={avatarSrc}
                      alt={player.nickname}
                      width={['50px', '65px', '80px']}
                      borderRadius='full'
                      animation={
                        player.uuid === turnPlayerId
                          ? `${pulseGlow} 1.5s ease-in-out infinite`
                          : 'none'
                      }
                      filter={
                        isInConspiracy
                          ? 'grayscale(100%) brightness(0.5)'
                          : 'none'
                      }
                      opacity={isInConspiracy ? 0.5 : 1}
                      transition='filter 0.5s ease, opacity 0.5s ease'
                    />
                    <Text
                      mt='2px'
                      fontSize={['xs', 'sm']}
                      color='white'
                      fontWeight='bold'
                      textShadow='0 0 3px black'
                      textAlign='center'
                      maxW='80px'
                      overflow='hidden'
                      whiteSpace='nowrap'
                      textOverflow='ellipsis'
                    >
                      {player.nickname}
                    </Text>
                    <Text
                      mt='1px'
                      fontSize={['2xs', 'xs']}
                      color='white'
                      textShadow='0 0 3px black'
                      textAlign='center'
                      maxW='80px'
                      overflow='hidden'
                      whiteSpace='nowrap'
                      textOverflow='ellipsis'
                    >
                      hand size: {player?.hand?.length}
                    </Text>
                  </Box>

                  <Box
                    position='absolute'
                    display='flex'
                    // flexDirection='column'
                    gap='4px'
                    p={1}
                    bg='rgba(0,0,0,0.4)'
                    borderRadius='md'
                    zIndex={1}
                    {...getPilePosition(positions[index % positions.length])}
                  >
                    {pileCounts &&
                      Object.entries(pileCounts).map(([cardNum, count]) => {
                        const card = parseInt(cardNum);
                        const imageSrc = CardNumberToImage[card];
                        const label = CardNumberToString[card];

                        return (
                          <Box
                            key={`pile-${index}-${card}`}
                            display='flex'
                            alignItems='center'
                            gap='6px'
                          >
                            <Image
                              src={imageSrc}
                              alt={label}
                              height='30px'
                              objectFit='contain'
                            />
                            <Text
                              fontSize='sm'
                              color='white'
                              whiteSpace='nowrap'
                            >
                              ×{count}
                            </Text>
                          </Box>
                        );
                      })}
                  </Box>
                </Box>
              );
            })}

            {gameRoom.currentAction &&
              gameRoom.currentAction.conspiracy.length === 1 && ( // THIS PART CONTROLS CENTER CARD APPEAR/DISAPPEAR
                <Box
                  position='absolute'
                  top='50%'
                  left='50%'
                  transform='translate(-50%, -50%)'
                  width={['80px', '100px', '120px']}
                  height={['120px', '140px', '160px']}
                  backgroundColor='#264653'
                  border='4px solid white'
                  borderRadius='md'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  boxShadow='0 0 20px rgba(0,0,0,0.5)'
                  zIndex='3'
                >
                  <Image
                    src='/cards/back.png'
                    alt='Facedown Card'
                    objectFit='cover'
                    width='100%'
                    height='100%'
                    borderRadius='md'
                  />
                </Box>
              )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default GamePage;
