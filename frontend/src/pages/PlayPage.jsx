import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  SimpleGrid,
  Image,
  Avatar,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';

import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const socketUrl = window.location.origin.includes('localhost')
  ? 'http://localhost:8420'
  : 'https://cockroach.poker';
const socket = io(socketUrl, { autoConnect: false });

const PlayPage = () => {
  const toast = useToast();
  const turnPlayerModal = useDisclosure();
  const [message, setMessage] = useState('Connecting socket...');
  const [player, setPlayer] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const location = useLocation();
  const roomCode = location.state?.roomCode;
  const uuid = location.state?.uuid;
  const avatar = location.state?.avatar;
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [claim, setClaim] = useState(0);
  const [callMode, setCallMode] = useState(false);
  const [passMode, setPassMode] = useState(false);
  const [gameRoom, setGameRoom] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isFirstTurnInGameAction, setIsFirstTurnInGameAction] = useState(false);
  const [players, setPlayers] = useState([]);

  const selectCardDrawer = useDisclosure();
  const selectPlayerDrawer = useDisclosure();
  const makeStatementDrawer = useDisclosure();
  const mainActionDrawer = useDisclosure();
  const [receivedCardData, setReceivedCardData] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [showPile, setShowPile] = useState(false);

  const handleJoinRoom = (roomCode) => {
    socket.emit('joinSocketRoom', roomCode);
  };

  const handleCardSelection = (card) => {
    setSelectedCard(card);
    selectCardDrawer.onClose();
    selectPlayerDrawer.onOpen();
  };

  const handlePlayerSelection = (player) => {
    setSelectedPlayer(player);
    selectPlayerDrawer.onClose();
    makeStatementDrawer.onOpen();
  };

  const handleStatementSubmit = () => {
    if (claim === 0) {
      toast({
        title: 'Please pick a claim.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    console.log('Requesting start round:', {
      player: selectedPlayer.uuid,
      card: selectedCard,
      claim: claim,
    });

    socket.emit(
      'requestPlayerStartRound',
      roomCode,
      uuid,
      selectedPlayer.uuid,
      selectedCard,
      claim
    );

    makeStatementDrawer.onClose();
    setSelectedCard(null);
    setSelectedPlayer(null);
    setClaim(0);
    setIsFirstTurnInGameAction(false);
    setIsMyTurn(false);

    toast({
      title: 'Card sent!',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  const handleCallCard = (callAs) => {
    socket.emit('requestPlayerCallCard', roomCode, uuid, callAs);
    const reality = currentAction.claim === currentAction.card;
    if (reality === callAs) {
      toast({
        title: 'Phew - good call!',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    } else {
      toast({
        title: `Oops - that's wrong!`,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
    setCallMode(false);
    setIsMyTurn(false);
    turnPlayerModal.onClose();
  };

  const startCardAction = () => {
    mainActionDrawer.onClose();
    selectCardDrawer.onOpen();
  };

  const getPlayerName = (givenUUID) => {
    const foundPlayer = players.find((p) => p.uuid == givenUUID);
    return foundPlayer ? foundPlayer.nickname : 'Unknown Player';
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      setSocketReady(true);
    };

    const handleReturnNewRound = (loserId, loserName) => {
      if (loserId === uuid) {
        toast({
          title: 'You lost the round! Go again.',
          status: 'info',
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: `New round! ${loserName} starts.`,
          status: 'info',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    const handleReturnPlayer = (player) => {
      if (!player) {
        console.error('Received player: null');
        return;
      }

      const avatarName = location.state?.avatar;
      player.avatar = avatarMap[avatarName] || '/avatars/default.png';
      setPlayer(player);
    };

    const handleReturnGameRoom = (gameRoom) => {
      if (!gameRoom) {
        console.warn('Received game room: null');
        return;
      }

      setPlayers(gameRoom.players || []);
      setGameRoom(gameRoom);
      setCurrentAction(gameRoom.currentAction);
      console.log('Received GameRoom:');
      console.log(gameRoom);

      for (const p of gameRoom.players) {
        if (p.uuid === uuid) {
          setPlayer(p);
          break;
        }
      }

      const currentAction = gameRoom.currentAction;
      if (currentAction && currentAction.turnPlayer === uuid) {
        setIsMyTurn(true);
        if (currentAction.prevPlayer === uuid) {
          setIsFirstTurnInGameAction(true);
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('returnPlayer', handleReturnPlayer);
    socket.on('returnGameRoom', handleReturnGameRoom);
    socket.on('returnNewRound', handleReturnNewRound);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnPlayer', handleReturnPlayer);
      socket.off('returnGameRoom', handleReturnGameRoom);
      socket.off('returnNewRound', handleReturnNewRound);
    };
  }, []);

  useEffect(() => {
    if (isMyTurn && !isFirstTurnInGameAction) {
      console.log(
        'Opening turn modal because isMyTurn is true and not first turn'
      );
      turnPlayerModal.onOpen();
    }
  }, [isMyTurn, isFirstTurnInGameAction]);

  // TODO: Remove
  useEffect(() => {
    if (socketReady && roomCode && uuid) {
      socket.emit('getPlayer', roomCode, uuid);
      socket.emit('setSocketId', roomCode, uuid, socket.id);
      socket.emit('requestGameRoom', roomCode);
    }
  }, [socketReady, location]);

  useEffect(() => {
    if (uuid) {
      handleJoinRoom(roomCode);
    }
  }, [uuid]);

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
    jake: '/avatars/jake.png',
    mermaid: '/avatars/mermaid.png',
    'navi-avatar': '/avatars/navi-avatar.png',
    'wonder-woman': '/avatars/wonder-woman.png',
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
      <Modal
        isOpen={turnPlayerModal.isOpen}
        onClose={turnPlayerModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg='#FFF7D6' borderRadius='md' p={6}>
          <ModalHeader textAlign='center'>Your Turn!</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <VStack>
              <Image
                src={CardNumberToImage[0]}
                alt={CardNumberToString[0]}
                height='200'
                objectFit='contain'
                mb={2}
              />
              <Text fontSize='lg'>
                <Text as={'span'} fontWeight={'bold'}>
                  {getPlayerName(currentAction?.prevPlayer)}
                </Text>{' '}
                says this card is a{' '}
                <Text as={'span'} fontWeight={'bold'}>
                  {CardNumberToString[currentAction?.claim]}
                </Text>
                .
              </Text>
              <Text fontSize='lg' mb={3}>
                {callMode ? 'Call it!' : 'What will you do?'}
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter display='flex' justifyContent='center' gap={4}>
            {callMode ? (
              <>
                <Button
                  colorScheme='green'
                  onClick={() => handleCallCard(true)}
                >
                  True
                </Button>
                <Button colorScheme='red' onClick={() => handleCallCard(false)}>
                  False
                </Button>
              </>
            ) : (
              // === First layer options ===
              <>
                <Button
                  colorScheme='green'
                  onClick={() => {
                    console.log('Player chose to CALL IT');
                    setCallMode(true);
                  }}
                >
                  Call It
                </Button>
                <Button
                  colorScheme='yellow'
                  onClick={() => {
                    console.log('Player chose to PASS IT');
                    setPassMode(true);
                    turnPlayerModal.onClose();
                  }}
                  disabled={
                    currentAction?.conspiracy.length >= gameRoom?.numPlayers - 1
                  }
                >
                  Pass It
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        width={{ base: '90%', md: '70%', lg: '50%', xl: '40%' }}
        maxHeight={{ base: '90vh', md: '90vh' }}
        bg='#FFF9C4'
        border='2px solid #FBC02D'
        borderRadius='md'
        boxShadow='xl'
        p='5%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        textAlign='center'
        overflowY='auto'
      >
        {!uuid ? (
          <Navigate
            to='/rejoin'
            replace
            state={{ uuid: uuid, roomCode: roomCode }}
          />
        ) : player ? (
          <Stack spacing={3} width='100%'>
            {player && (
              <Box
                width='100%'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mb={4}
              >
                <Button
                  onClick={() => setShowPile((prev) => !prev)}
                  variant='outline'
                  colorScheme='teal'
                >
                  {showPile ? (
                    <Text as={'span'}>Show Hand ({player?.handSize})</Text>
                  ) : (
                    <Text as={'span'}>Show Pile ({player?.pileSize})</Text>
                  )}
                </Button>
                <HStack spacing={3}>
                  <Avatar
                    size='md'
                    src={player.avatar}
                    name={player.nickname}
                  />
                  <Text fontSize='lg' fontWeight='bold'>
                    {player.nickname}
                  </Text>
                </HStack>
                <Text fontSize='sm' color='gray.500'>
                  {`PlayerID: ${player.uuid?.slice(0, 6)}...`}
                </Text>
              </Box>
            )}
            {gameRoom.gameStatus === 1 ? (
              <>
                <Card>
                  <CardHeader bg='#FBC02D' borderTopRadius='md'>
                    <Heading size='md' textAlign='center'>
                      {showPile ? (
                        <Text>Your Pile ({player.pileSize})</Text>
                      ) : (
                        <Text>Your Hand ({player.handSize})</Text>
                      )}
                    </Heading>
                  </CardHeader>
                  <CardBody maxHeight='300px' overflowY='auto' p={4}>
                    <SimpleGrid columns={2} spacing={4}>
                      {(showPile ? player?.pile || [] : player?.hand || []).map(
                        (card, index) => (
                          <Box
                            key={`${card}-${index}`}
                            bg='white'
                            height='200'
                            borderRadius='md'
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            flexDirection='column'
                            transition='all 0.2s'
                          >
                            <Image
                              src={CardNumberToImage[card]}
                              alt={CardNumberToString[card]}
                              height='200'
                              objectFit='contain'
                              mb={2}
                            />
                          </Box>
                        )
                      )}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {isFirstTurnInGameAction ? (
                  <Button
                    colorScheme='yellow'
                    onClick={selectCardDrawer.onOpen}
                    width='100%'
                  >
                    Play!
                  </Button>
                ) : isMyTurn ? (
                  <Button
                    colorScheme='yellow'
                    width='100%'
                    onClick={() => {
                      console.log('Not first turn: opening call/pass modal');
                      turnPlayerModal.onOpen();
                    }}
                  >
                    It's your turn! (Call or Pass)
                  </Button>
                ) : (
                  <Button colorScheme='gray' width='100%' disabled>
                    It's not your turn yet.
                  </Button>
                )}
              </>
            ) : (
              <>
                <Text fontSize='xl'>
                  Waiting for the host to start the game...
                </Text>{' '}
                <Text fontSize='xl'>
                  Players:{' '}
                  <Text as='span' fontWeight={'semibold'}>
                    {gameRoom.numPlayers}
                    /6
                  </Text>
                </Text>
              </>
            )}
            {isMyTurn ? (
              isFirstTurnInGameAction ? (
                <Text size='lg'>It's your turn to start the round!</Text>
              ) : (
                <Text size='lg'>It's your turn!</Text>
              )
            ) : (
              ''
            )}
            <Drawer
              isOpen={selectCardDrawer.isOpen}
              placement='right'
              onClose={selectCardDrawer.onClose}
              size='md'
            >
              <DrawerOverlay />
              <DrawerContent bg='#F4A261'>
                <DrawerCloseButton />
                <DrawerHeader bg='#E76F51'>Select a Card</DrawerHeader>
                <DrawerBody>
                  <Text mb={4}>Choose one of your cards to send:</Text>
                  <SimpleGrid columns={2} spacing={4}>
                    {player?.hand?.map((card, index) => (
                      <Box
                        key={index}
                        height='200'
                        borderRadius='md'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        cursor='pointer'
                        onClick={() => handleCardSelection(card)}
                        _hover={{
                          borderColor: 'teal.300',
                          transform: 'scale(1.05)',
                        }}
                        transition='all 0.2s'
                        flexDirection='column'
                      >
                        <Image
                          src={CardNumberToImage[card]}
                          alt={CardNumberToString[card]}
                          boxSize='200'
                          objectFit='contain'
                          mb={2}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant='outline' onClick={selectCardDrawer.onClose}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Drawer
              isOpen={selectPlayerDrawer.isOpen}
              placement='right'
              onClose={selectPlayerDrawer.onClose}
              size='md'
            >
              <DrawerOverlay />
              <DrawerContent bg='#F4A261'>
                <DrawerCloseButton />
                <DrawerHeader bg='#E76F51'>Choose a Player</DrawerHeader>
                <DrawerBody>
                  <Text mb={4}>
                    Select a player to send a{' '}
                    <Text as={'span'} fontWeight={'bold'}>
                      {CardNumberToString[selectedCard]}
                    </Text>{' '}
                    to:
                  </Text>
                  <VStack spacing={4} align='stretch'>
                    {players
                      .filter((p) => p.uuid !== player?.uuid)
                      .map((otherPlayer) => {
                        const isInConspiracy =
                          receivedCardData?.conspiracyList?.includes(
                            otherPlayer.uuid
                          );

                        return (
                          <Box
                            key={otherPlayer.uuid}
                            bg='white'
                            p={4}
                            border='2px solid'
                            borderColor={
                              selectedPlayer?.uuid === otherPlayer.uuid
                                ? 'teal.500'
                                : 'gray.200'
                            }
                            borderRadius='md'
                            display='flex'
                            alignItems='center'
                            opacity={isInConspiracy ? 0.5 : 1} // grey out if in conspiracy list
                            pointerEvents={isInConspiracy ? 'none' : 'auto'} // unclickable
                            cursor={isInConspiracy ? 'not-allowed' : 'pointer'} // change curson to cancel
                            onClick={() =>
                              !isInConspiracy &&
                              handlePlayerSelection(otherPlayer)
                            }
                            _hover={
                              !isInConspiracy
                                ? {
                                    borderColor: 'teal.300',
                                    transform: 'translateX(5px)',
                                  }
                                : {}
                            }
                            transition='all 0.2s'
                          >
                            <Avatar
                              size='md'
                              src={
                                avatarMap[otherPlayer.playerIcon] ||
                                '/avatars/default.png'
                              }
                              name={otherPlayer.nickname}
                            />
                            <Text fontWeight='bold' ml={3}>
                              {otherPlayer.nickname}
                            </Text>
                          </Box>
                        );
                      })}
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    variant='outline'
                    mr={3}
                    onClick={() => {
                      selectPlayerDrawer.onClose();
                      selectCardDrawer.onOpen();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant='outline'
                    onClick={selectPlayerDrawer.onClose}
                  >
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Drawer
              isOpen={makeStatementDrawer.isOpen}
              placement='right'
              onClose={makeStatementDrawer.onClose}
              size='md'
            >
              <DrawerOverlay />
              <DrawerContent bg='#F4A261'>
                <DrawerCloseButton />
                <DrawerHeader bg='#E76F51'>Make a Claim</DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align='stretch'>
                    <Text>
                      You're sending a{' '}
                      <Text fontWeight={'bold'} as={'span'}>
                        {CardNumberToString[selectedCard]}
                      </Text>{' '}
                      to{' '}
                      <Text fontWeight={'bold'} as={'span'}>
                        {selectedPlayer?.nickname}
                      </Text>
                      .
                    </Text>
                    <Image
                      src={CardNumberToImage[selectedCard]}
                      alt={CardNumberToString[selectedCard]}
                      height='200'
                      objectFit='contain'
                      mb={2}
                    />
                    <Text fontWeight='bold'>
                      What will you claim this card is?
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Your claim can be{' '}
                      <Text as='span' color='green.600' fontWeight='bold'>
                        the truth
                      </Text>{' '}
                      or{' '}
                      <Text as='span' color='gray.800' fontWeight='bold'>
                        a lie
                      </Text>
                      . Other players will decide whether to believe you or
                      challenge your claim.
                    </Text>
                    <Box bg='#FFF9C4' p={4} borderRadius='md'>
                      <Text mb={2} fontWeight='bold'>
                        This card is a...
                      </Text>
                      <SimpleGrid columns={2} spacing={3}>
                        {Object.entries(CardNumberToString)
                          .filter(([key]) => key !== '0')
                          .map(([num, label]) => (
                            <Button
                              key={num}
                              onClick={() => setClaim(Number(num))}
                              bg={claim === Number(num) ? '#f2ecb8' : ''} // yellow background when selected
                              borderColor={
                                claim === Number(num) ? 'gray.600' : 'gray.300'
                              } // thicker border when selected
                              borderWidth={
                                claim === Number(num) ? '2px' : '1px'
                              }
                              variant='outline'
                              _hover={{
                                transform: 'scale(1.05)',
                                boxShadow: 'md',
                              }}
                              color={
                                selectedCard === Number(num) ? 'green.600' : ''
                              }
                            >
                              {label}
                            </Button>
                          ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    variant='outline'
                    mr={3}
                    onClick={() => {
                      makeStatementDrawer.onClose();
                      selectPlayerDrawer.onOpen();
                    }}
                  >
                    Back
                  </Button>
                  <Button colorScheme='teal' onClick={handleStatementSubmit}>
                    Send Card
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Stack>
        ) : (
          <Text>
            GameRoom {roomCode} or Player UUID {uuid} does not exist.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default PlayPage;
