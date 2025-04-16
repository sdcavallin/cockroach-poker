import {
  Box,
  Button,
  Text,
  Image,
  VStack,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Card,
  CardBody,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:5000', { autoConnect: false });

const HomePage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
    };

    const handleReturnEmptyGameRoom = (gameRoom) => {
      console.log(gameRoom.roomCode);
      navigate('/host', { state: { roomCode: gameRoom.roomCode } });
    };

    socket.on('connect', handleConnect);
    socket.on('returnEmptyGameRoom', handleReturnEmptyGameRoom);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnEmptyGameRoom', handleReturnEmptyGameRoom);
    };
  }, []);

  const handleCreate = () => {
    socket.emit('requestCreateEmptyGameRoom');
  };

  // === Waiting Room ===
  /*
  if (gameRoom) {
    return (
      <Container>
        <Text>Socket state: {message}</Text>
        <Heading size='lg'>Game Setup</Heading>
        <Stack spacing={3}>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={3}>
                <Heading size='lg'>Join with Code: {gameRoom.roomCode}</Heading>
                {gameRoom.players.map((player, index) => (
                  <Box key={index}>
                    <Heading size='md'>Player: {player.nickname}</Heading>
                    <Text size='sm'>UUID: {player.uuid}</Text>
                    <Text size='sm'>Avatar: {player.playerIcon}</Text>
                    <Text size='sm'>Socket: {player.socketId}</Text>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Button
            isDisabled={gameRoom.numPlayers < 2}
            onClick={handleStartGame}
          >
            Start Game ({gameRoom.numPlayers} players)
          </Button>
        </Stack>
      </Container>
    );
  }*/

  // === Default Landing Page ===
  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#2A9D8F'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={{ base: '5%', sm: '4%', md: '3%', lg: '2%', xl: '1%' }}
    >
      <HStack
        spacing={{ base: '5%', sm: '4%', md: '3%', lg: '2%', xl: '1%' }}
        width={{ base: '90%', sm: '85%', md: '80%', lg: '75%', xl: '70%' }}
        height={{ base: '85%', sm: '80%', md: '75%', lg: '70%', xl: '65%' }}
        justifyContent='center'
        alignItems='center'
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box
          bg='#F4A261'
          p={{ base: 4, sm: 6, md: 8 }}
          borderRadius='md'
          boxShadow='lg'
          border='4px solid'
          borderColor='#33A00A'
          width={{
            base: '90%',
            sm: '80%',
            md: '70%',
            lg: '50%',
            xl: '40%',
          }}
        >
          <VStack spacing={6} alignItems='center'>
            <Text
              fontSize={{
                base: '8vw',
                sm: '6vw',
                md: '4vw',
                lg: '3vw',
                xl: '2.5vw',
              }}
              fontWeight='bold'
              textAlign='center'
              color='#264653'
            >
              COCKROACH <br /> POKER🪳
            </Text>

            <Box width='100%'>
              <Button
                onClick={handleCreate}
                bg='#E9C46A'
                color='#264653'
                _hover={{ bg: '#F4A261' }}
                width='100%'
                fontSize={{
                  base: '5vw',
                  sm: '4vw',
                  md: '3vw',
                  lg: '2.5vw',
                  xl: '2vw',
                }}
                py='6'
                isDisabled={isMobile}
              >
                CREATE
              </Button>
            </Box>

            <Box width='100%' mt={{ base: 0, md: 1 }}>
              <Button
                as={Link}
                to='/join'
                bg='#E9C46A'
                color='#264653'
                _hover={{ bg: '#F4A261' }}
                width='100%'
                fontSize={{
                  base: '5vw',
                  sm: '4vw',
                  md: '3vw',
                  lg: '2.5vw',
                  xl: '2vw',
                }}
                py='6'
              >
                JOIN
              </Button>
            </Box>
          </VStack>
        </Box>

        <Image
          src='/cards/back.png'
          alt='Back'
          width={{
            base: '30%',
            sm: '25%',
            md: '25%',
            lg: '25%',
            xl: '20%',
          }}
          transform={{ base: 'rotate(15deg)', md: 'rotate(20deg)' }}
        />
      </HStack>
    </Box>
  );
};

export default HomePage;
