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
  // Modal
} from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useToast } from '@chakra-ui/react';

// const toast = useToast();

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const avatar = Cookies.get('avatar');


const PlayerPlay = () => {
  const toast = useToast();
  const [message, setMessage] = useState('Connecting socket...');
  const [player, setPlayer] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const roomCode = Cookies.get('roomCode');
  const uuid = Cookies.get('uuid');

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [statement, setStatement] = useState('');

  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  const selectCardDrawer = useDisclosure();
  const selectPlayerDrawer = useDisclosure();
  const makeStatementDrawer = useDisclosure();
  const mainActionDrawer = useDisclosure();
  const [receivedCardData, setReceivedCardData] = useState(null);
  // const [cardModalOpen, setCardModalOpen] = useState(false);
  const [showPile, setShowPile] = useState(false);

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
      `Card ${selectedCard} sent to ${selectedPlayer.nickname} with statement: "${statement}"`
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
  
      const avatarName = Cookies.get('avatar');
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
    const roomCode = Cookies.get('roomCode');
    const uuid = Cookies.get('uuid');

    if (socketReady && roomCode && uuid) {
      socket.emit('getPlayer', roomCode, uuid);
      socket.emit('setSocketId', roomCode, uuid, socket.id);
      socket.emit('requestGameRoom', roomCode);
    }
  }, [socketReady]);

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
    'bmo': '/avatars/bmo.png',
    'cookie-monster': '/avatars/cookie-monster.png',
    'finn': '/avatars/finn.png',
    'genie-lamp': '/avatars/genie-lamp.png',
    'jake': '/avatars/jake.png',
    'mermaid': '/avatars/mermaid.png',
    'navi-avatar': '/avatars/navi-avatar.png',
    'wonder-woman': '/avatars/wonder-woman.png',
  };
  

  useEffect(() => {
    const handleTurnPlayerUpdate = (turnPlayerId) => {
      if (turnPlayerId === player?.uuid) {
        toast({
          title: 'Your Turn!',
          description: 'Another player has sent you a card',
          status: 'info',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    };

    socket.on('turnPlayerUpdated', handleTurnPlayerUpdate);

    return () => {
      socket.off('turnPlayerUpdated', handleTurnPlayerUpdate);
    };
  }, [player, toast]);

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
      {/* <Modal isOpen={cardModalOpen} onClose={() => setCardModalOpen(false)} isCentered>
  <ModalOverlay />
  <ModalContent bg="#fff7d6" p={6} borderRadius="md">
    <ModalHeader textAlign="center">You Received a Card!</ModalHeader>
    <ModalCloseButton />
    <ModalBody textAlign="center">
      <Text fontSize="lg" mb={3}>
        The other player claimed: <strong>{receivedCardData?.claim}</strong>
      </Text>
      <Text fontSize="md" color="gray.500" mb={4}>
        Conspiracy path: {receivedCardData?.conspiracyList?.join(', ') || 'None'}
      </Text>
      <Button
        colorScheme="green"
        onClick={() => {
          setCardModalOpen(false);
          const accepted = window.confirm('Do you accept the claim? Click "Cancel" to contest.');
          if (accepted) {
            const callBoolean = window.confirm('Do you think the claim is TRUE?');
            socket.emit('cardResolution', player.uuid, callBoolean);
          } else {
            socket.emit('playerCheckCard', player.uuid);
          }
        }}
      >
        Respond to Claim
      </Button>
    </ModalBody>
  </ModalContent>
</Modal> */}

      <Box
        width={{ base: '90%', md: '70%', lg: '50%', xl: '40%' }}
        maxHeight={{ base: '85vh', md: '90vh' }}
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
          <Navigate to='/Rejoin' replace />
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
                  variant="outline"
                  colorScheme="teal"
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
            <Card>
              <CardHeader bg='#FBC02D' borderTopRadius='md'>
              <Heading size='md' textAlign='center'>
                {showPile ? 'Your Pile' : 'Your Hand'}
              </Heading>

              </CardHeader>
              <CardBody maxHeight='300px' overflowY='auto' p={4}>
                <SimpleGrid columns={2} spacing={4}>
                {(showPile ? player?.pile || [] : player?.hand || []).map((card, index) => (
                    <Box
                      key={`${card}-${index}`}
                      bg='white'
                      height='140px'
                      border='2px solid'
                      borderColor={
                        selectedCard === card ? 'teal.500' : 'gray.200'
                      }
                      borderRadius='md'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      flexDirection='column'
                      _hover={{
                        borderColor: 'teal.300',
                        transform: 'scale(1.05)',
                      }}
                      transition='all 0.2s'
                      cursor='pointer'
                      onClick={() => handleCardSelection(card)}
                    >
                      <Image
                        src={CardNumberToImage[card]}
                        alt={CardNumberToString[card]}
                        height='80px'
                        objectFit="contain"
                        mb={2}
                      />
                      <Text fontWeight='bold'>{CardNumberToString[card]}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            <Button
              colorScheme='yellow'
              onClick={selectCardDrawer.onOpen}
              width='100%'
            >
              Play!
            </Button>

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
                        bg='white'
                        height='140px'
                        border='2px solid'
                        borderColor={
                          selectedCard === card ? 'teal.500' : 'gray.200'
                        }
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
                          boxSize='80px'
                          mb={2}
                        />
                        <Text fontWeight='bold'>
                          {CardNumberToString[card]}
                        </Text>
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
                      .map((otherPlayer) => (
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
                          cursor='pointer'
                          onClick={() => handlePlayerSelection(otherPlayer)}
                          _hover={{
                            borderColor: 'teal.300',
                            transform: 'translateX(5px)',
                          }}
                          transition='all 0.2s'
                        >
                          <Avatar
                            size='md'
                            src={player.avatar}
                            name={player.nickname}
                          />
                          <Text fontWeight='bold'>{otherPlayer.nickname}</Text>
                        </Box>
                      ))}
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
                <DrawerHeader bg='#E76F51'>Make a Statement</DrawerHeader>
                <DrawerBody>
                  <VStack spacing={4} align='stretch'>
                    <Text>
                      You're sending card {selectedCard} to{' '}
                      {selectedPlayer?.nickname}
                    </Text>
                    <Text fontWeight='bold'>
                      What statement will you make about this card?
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Your statement can be truthful or a bluff. Other players
                      will decide whether to believe you or challenge your
                      claim.
                    </Text>
                    <Box bg='#FFF9C4' p={4} borderRadius='md'>
                      <Text mb={2} fontWeight='bold'>
                        This card is a:
                      </Text>
                      <SimpleGrid columns={2} spacing={3}>
                        {Object.entries(CardNumberToString)
                          .filter(([key]) => key !== "0")
                          .map(([num, label]) => (
                            <Button
                              key={num}
                              colorScheme={statement === label ? 'teal' : 'gray'}
                              variant={statement === label ? 'solid' : 'outline'}
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
            GameRoom {roomCode} or Player UUID {uuid} does not
            exist.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default PlayerPlay;
