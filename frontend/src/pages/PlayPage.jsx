import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  SimpleGrid,
  Image,
  Avatar,
  VStack,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter, // ← Add this!
} from '@chakra-ui/react';

import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

// const toast = useToast();

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

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
  const [statement, setStatement] = useState('');
  const [callMode, setCallMode] = useState(false);
  const [gameRoom, setGameRoom] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isFirstTurnInGameAction, setIsFirstTurnInGameAction] = useState(false);

  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

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
    if (!statement.trim()) {
      alert('Please enter a statement');
      return;
    }

    console.log('Sending card:', {
      card: selectedCard,
      player: selectedPlayer,
      statement: statement,
    });

    socket.emit(
      'initPlayerSendCard',
      player?.uuid,
      selectedPlayer.uuid,
      selectedCard,
      statement
    );

    makeStatementDrawer.onClose();
    setSelectedCard(null);
    setSelectedPlayer(null);
    setStatement('');
    alert(
      `Card ${selectedCard} sent to ${selectedPlayer.nickname} with statement: '${statement}'`
    );
  };

  const startCardAction = () => {
    mainActionDrawer.onClose();
    selectCardDrawer.onOpen();
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

    const handleReturnPlayer = (player) => {
      if (!player) {
        console.error('Received player: null');
        return;
      }

      const avatarName = location.state?.avatar;
      player.avatar = avatarMap[avatarName] || '/avatars/default.png';
      setPlayer(player);
    };

    const handleRecieveCard = (claim, conspiracyList) => {
      setReceivedCardData({ claim, conspiracyList });
      setCardModalOpen(true);
    };

    const handleReturnGameRoom = (gameRoom) => {
      if (!gameRoom) {
        console.error('Received game room: null');
        return;
      }

      setPlayers(gameRoom.players || []);
      setGameRoom(gameRoom);
      console.log(gameRoom);

      for (const p of gameRoom.players) {
        if (p.uuid === uuid) {
          setPlayer(p);
          break;
        }
      }

      const gameAction = gameRoom.currentAction;
      if (gameAction && gameAction.turnPlayer === uuid) {
        setIsMyTurn(true);
        if (gameAction.prevPlayer === uuid) {
          setIsFirstTurnInGameAction(true);
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('returnPlayer', handleReturnPlayer);
    socket.on('playerRecieveCard', handleRecieveCard);
    socket.on('returnGameRoom', handleReturnGameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnPlayer', handleReturnPlayer);
      socket.off('playerRecieveCard', handleRecieveCard);
      socket.off('returnGameRoom', handleReturnGameRoom);
    };
  }, []);

  useEffect(() => {
    //Numbers and strings are truthy so it should show as true
    if (socketReady && roomCode && uuid) {
      socket.emit('getPlayer', roomCode, uuid);
      socket.emit('setSocketId', roomCode, uuid, socket.id);
      socket.emit('requestGameRoom', roomCode);
    }
  }, [socketReady, location]);

  useEffect(() => {
    const handleTurnPlayerUpdate = (turnPlayerId) => {
      console.log('[TURN EVENT]', { turnPlayerId, playerId: player?.uuid });
      if (turnPlayerId === player?.uuid) {
        console.log('MATCHING TURN PLAYER');
        turnPlayerModal.onOpen();
      }
    };

    socket.on('turnPlayerUpdated', handleTurnPlayerUpdate);

    return () => {
      socket.off('turnPlayerUpdated', handleTurnPlayerUpdate);
    };
  }, [player, toast]);

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
            <Text fontSize='lg' mb={3}>
              {callMode
                ? 'Do you believe the claim?'
                : "It's your turn to make a move."}
            </Text>
          </ModalBody>

          <ModalFooter display='flex' justifyContent='center' gap={4}>
            {callMode ? (
              <>
                <Button
                  colorScheme='green'
                  onClick={() => {
                    console.log('Player thinks the claim is TRUE');
                    socket.emit('cardResolution', player.uuid, true);
                    setCallMode(false);
                    turnPlayerModal.onClose();
                  }}
                >
                  True
                </Button>
                <Button
                  colorScheme='red'
                  onClick={() => {
                    console.log('Player thinks the claim is FALSE');
                    socket.emit('cardResolution', player.uuid, false);
                    setCallMode(false);
                    turnPlayerModal.onClose();
                  }}
                >
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
                    setCallMode(false);
                    turnPlayerModal.onClose();
                  }}
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
                  Show {showPile ? 'Hand' : 'Pile'}
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
                  {`You are Player ID: ${player.uuid?.slice(0, 6)}...`}
                </Text>
              </Box>
            )}
            {gameRoom.gameStatus === 1 ? (
              <>
                <Card>
                  <CardHeader bg='#FBC02D' borderTopRadius='md'>
                    <Heading size='md' textAlign='center'>
                      {showPile ? 'Your Pile' : 'Your Hand'}
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
                            // // border='2px solid'
                            // borderColor={
                            //   selectedCard === card ? 'teal.500' : 'gray.200'
                            // }
                            borderRadius='md'
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            flexDirection='column'
                            _hover={
                              {
                                // borderColor: 'teal.300',
                                // transform: 'scale(1.05)',
                              }
                            }
                            transition='all 0.2s'
                            //cursor='pointer'
                            //onClick={() => handleCardSelection(card)}
                          >
                            <Image
                              src={CardNumberToImage[card]}
                              alt={CardNumberToString[card]}
                              height='200'
                              objectFit='contain'
                              mb={2}
                            />
                            {/* <Text fontWeight='bold'>
                          {CardNumberToString[card]}
                        </Text> */}
                          </Box>
                        )
                      )}
                    </SimpleGrid>
                  </CardBody>
                </Card>
                <Button
                  colorScheme='yellow'
                  onClick={selectCardDrawer.onOpen}
                  width='100%'
                  disabled={!(isMyTurn && isFirstTurnInGameAction)}
                >
                  {isMyTurn && isFirstTurnInGameAction
                    ? 'Play!'
                    : "It's not your turn yet."}
                </Button>
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
            {/*TODO: Replace this with a Toast and color change when its your turn and a Modal when you are NOT the first turn in gameAction (to select call or pass)*/}
            {isMyTurn ? <Text size='lg'>It's your turn!</Text> : ''}
            {isFirstTurnInGameAction ? (
              <Text size='lg'>
                You are starting the turn (e.g. you pick one of your own cards
                and who to send it to)
              </Text>
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
                    {player?.hand?.map((card) => (
                      <Box
                        key={card}
                        // bg='white'
                        height='200'
                        // border='2px solid'
                        // borderColor={
                        //   selectedCard === card ? 'teal.500' : 'gray.200'
                        // }
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
                        {/* <Text fontWeight='bold'>
                          {CardNumberToString[card]}
                        </Text> */}
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
                    Select a player to send card {selectedCard} to:
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
                      card to{' '}
                      <Text fontWeight={'bold'} as={'span'}>
                        {selectedPlayer?.nickname}
                      </Text>
                      .
                    </Text>
                    <Text fontWeight='bold'>
                      What will you claim this card is?
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Your statement can be{' '}
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
                              bg={statement === label ? '#f2ecb8' : ''}
                              color={
                                CardNumberToString[selectedCard] === label
                                  ? 'green.600'
                                  : ''
                              }
                              borderColor={
                                statement === label ? 'gray.600' : 'gray.300'
                              }
                              variant={'outline'}
                              borderWidth={statement === label ? '2px' : '1px'}
                              onClick={() => setStatement(label)}
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
