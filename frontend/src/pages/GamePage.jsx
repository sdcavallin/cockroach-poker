import { Box, Text, Container, Image, HStack, VStack } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const socket = io('http://localhost:5000', { autoConnect: false });

const cardEntrance = keyframes`
  0% {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px 4px rgba(233, 196, 106, 0.6); }
  50% { box-shadow: 0 0 20px 10px rgba(233, 196, 106, 1); }
  100% { box-shadow: 0 0 10px 4px rgba(233, 196, 106, 0.6); }
`;

const avatarGlow = keyframes`
  0% { box-shadow: 0 0 20px 10px rgba(72, 187, 120, 0.6); }
  50% { box-shadow: 0 0 40px 25px rgba(72, 187, 120, 1); }
  100% { box-shadow: 0 0 20px 10px rgba(72, 187, 120, 0.6); }
`;

const correctGlow = keyframes`
  0% { box-shadow: 0 0 20px 10px rgba(72, 187, 120, 0.6); }
  50% { box-shadow: 0 0 40px 25px rgba(72, 187, 120, 1); }
  100% { box-shadow: 0 0 20px 10px rgba(72, 187, 120, 0.6); }
`;

const incorrectGlow = keyframes`
  0% { box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.6); }
  50% { box-shadow: 0 0 40px 25px rgba(255, 0, 0, 1); }
  100% { box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.6); }
`;

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
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      flexDirection: 'row',
    };
  }
  // Bottom center
  if (position.bottom === '5%' && position.left === '50%') {
    return {
      bottom: '30%',
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
  0: 'Unknown',
  1: 'Bat',
  2: 'Fly',
  3: 'Cockroach',
  4: 'Toad',
  5: 'Rat',
  6: 'Scorpion',
  7: 'Spider',
  8: 'Stinkbug',
};

const CardNumberToImage = {
  0: '/cards/back.png',
  1: '/cards/bat.png',
  2: '/cards/fly.png',
  3: '/cards/roach.png',
  4: '/cards/frog.png',
  5: '/cards/rat.png',
  6: '/cards/scorpion.png',
  7: '/cards/spider.png',
  8: '/cards/stinkbug.png',
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
  const isCorrect =
    gameRoom?.currentAction?.claim === gameRoom?.currentAction?.card;
  const [callResult, setCallResult] = useState(null);
  const [showCard, setShowCard] = useState(true); // to hold card for a bit & show color change
  const [revealPhase, setRevealPhase] = useState('waiting'); // 'waiting', 'revealed', 'hidden'
  const [savedAction, setSavedAction] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (gameRoom?.currentAction && revealPhase === 'waiting') {
      setSavedAction(gameRoom.currentAction);
    }
  }, [gameRoom?.currentAction, revealPhase]);

  const handleJoinRoom = (roomCode) => {
    socket.emit('joinSocketRoom', roomCode);
  };
  useEffect(() => {
    console.log('Current turnPlayerId:', turnPlayerId);
    console.log(
      'Player IDs:',
      gameRoom?.players.map((p) => p.uuid)
    );
  }, [turnPlayerId, gameRoom]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log(`Connected with id ${socket.id}`);
    });

    socket.on('returnGameRoom', (gameRoom) => {
      console.log('Received returnGameRoom', gameRoom);
      setGameRoom(gameRoom);
    });

    return () => {
      socket.off('connect');
      socket.off('returnGameRoom');
    };
  }, []);

  useEffect(() => {
    socket.on('playerCallResult', ({ correct }) => {
      console.log('Player call result:', correct);

      setCallResult(correct);

      if (savedAction) {
        toast({
          title: correct ? 'Correct!' : 'Wrong!',
          description: `The actual card was a ${
            CardNumberToString[savedAction.card]
          }.`,
          status: correct ? 'success' : 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    });

    return () => {
      socket.off('playerCallResult');
    };
  }, [savedAction]);

  useEffect(() => {
    if (callResult !== null) {
      // first show the result
      setRevealPhase('revealed');

      // then hide after 2 seconds
      const hideTimer = setTimeout(() => {
        setRevealPhase('hidden');
      }, 2000);

      return () => clearTimeout(hideTimer);
    }
  }, [callResult]);

  useEffect(() => {
    if (roomCode) {
      handleJoinRoom(roomCode);
    }
  }, [roomCode]);

  useEffect(() => {
    socket.on('turnPlayerUpdated', ({ turnPlayerId }) => {
      setTurnPlayerId(turnPlayerId);
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
    <>
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
          <Text
            position='absolute'
            bottom='-6%'
            left='50%'
            transform='translate(-50%, -50%)'
            fontSize={['30px', '40px', '50px']}
            fontWeight='bold'
            color='#264653'
            textAlign='center'
            opacity={0.2}
          >
            {/*TODO: Change this from low opacity in the center to normal opacity on top somewhere, optionally with glow*/}
            🔗cockroach.poker
          </Text>
          s
          <Text
            position='absolute'
            top='2'
            fontSize='xl'
            fontWeight='bold'
            color='#264653'
          >
            {/* TODO: Delete both of these and show in a cooler way */}
            Room Code: {roomCode} <br />
            {/* Turn player: {gameRoom?.currentAction?.turnPlayer}{' '} */}
          </Text>
          {gameRoom ? (
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
                      <Box
                        width={['50px', '65px', '80px']}
                        height={['50px', '65px', '80px']}
                        borderRadius='full'
                        overflow='hidden'
                        animation={
                          player.uuid === gameRoom?.currentAction?.turnPlayer
                            ? `${avatarGlow} 1.5s ease-in-out infinite`
                            : 'none'
                        }
                        filter={
                          isInConspiracy
                            ? 'grayscale(100%) brightness(0.5)'
                            : 'none'
                        }
                        opacity={isInConspiracy ? 0.5 : 1}
                        transition='filter 0.5s ease, opacity 0.5s ease'
                        border={
                          player.uuid === turnPlayerId
                            ? '2px solid rgba(233, 196, 106, 1)'
                            : 'none'
                        }
                        backgroundColor='rgba(255,255,255,0.1)'
                      >
                        <Image
                          // as='img'
                          src={avatarSrc}
                          alt={player.nickname}
                          width={['50px', '65px', '80px']}
                          borderRadius='full'
                          animation={
                            player.uuid === turnPlayerId
                              ? `${avatarGlow} 1.5s ease-in-out infinite`
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
                      </Box>
                      <Text
                        mt='2px'
                        fontSize={['xl', 'xl']}
                        color='white'
                        fontWeight='bold'
                        textShadow='0 0 3px black'
                        textAlign='center'
                        maxW='80px'
                        // overflow='hidden'
                        whiteSpace='nowrap'
                        // textOverflow='ellipsis'
                      >
                        {player.nickname}
                      </Text>
                      <HStack spacing='8px' mt='1px'>
                        <Image
                          src='/cards/back.png'
                          alt='Hand Card'
                          height='65px'
                          objectFit='contain'
                        />
                        <Text
                          fontSize='5xl'
                          color='black'
                          textShadow='0 0 9px white'
                        >
                          ×{player?.hand?.length}
                        </Text>
                      </HStack>
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
                                height='65px'
                                objectFit='contain'
                              />
                              <Text
                                fontSize='3xl'
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

              {savedAction &&
                savedAction.conspiracy.length === 1 &&
                revealPhase !== 'hidden' && (
                  // only hide when explicitly in 'hidden' phase
                  <VStack
                    position='absolute'
                    top='50%'
                    left='50%'
                    transform='translate(-50%, -50%)'
                    spacing={2}
                    zIndex='3'
                  >
                    <Box
                      width='600'
                      aspectRatio='6/6'
                      backgroundColor={
                        callResult === true
                          ? '#48BB78' // green for correct
                          : callResult === false
                          ? '#F56565' // red for wrong
                          : '#F3D475' // yellow neutral before call
                      }
                      borderRadius='md'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      boxShadow='0 0 100vw rgba(0,0,0,0.9)'
                      animation={`${cardEntrance} 0.6s ease`}
                      transition='background-color 0.5s ease, opacity 0.5s ease'
                    >
                      <Image
                        src={
                          revealPhase === 'revealed'
                            ? CardNumberToImage[gameRoom.currentAction.card] // try to show actual card when revealed
                            : '/cards/back.png'
                        } // otherwise just show back of card when waiting
                        alt={
                          revealPhase === 'revealed'
                            ? 'Revealed Card'
                            : 'Facedown Card'
                        }
                        width='90%'
                        height='90%'
                        objectFit='contain'
                        borderRadius='md'
                      />
                    </Box>

                    <Text
                      fontSize={['lg', 'xl', '2xl']}
                      fontWeight='bold'
                      color='white'
                      textShadow='0 0 5px black'
                      bg='rgba(0,0,0,0.5)'
                      px={4}
                      py={2}
                      borderRadius='md'
                    >
                      {revealPhase === 'revealed'
                        ? `ACTUAL CARD: ${
                            CardNumberToString[gameRoom.currentAction.card]
                          }`
                        : `CLAIM IS: ${
                            CardNumberToString[gameRoom.currentAction.claim]
                          }`}
                    </Text>
                  </VStack>
                )}
            </Box>
          ) : (
            <>
              <VStack>
                <Text fontSize={'2xl'}>Loading game...</Text>
                <Text fontSize={'lg'}>
                  If this doesn't load,{' '}
                  <Text
                    as={'span'}
                    color={'teal.500'}
                    textDecoration={'underline'}
                  >
                    <ChakraLink as={ReactRouterLink} to='/'>
                      try again.
                    </ChakraLink>
                  </Text>
                </Text>
              </VStack>
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default GamePage;
