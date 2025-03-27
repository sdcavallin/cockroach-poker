import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyPlayPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [player, setPlayer] = useState(null);
  const [actionUUID, setActionUUID] = useState(null);
  const [actionCard, setActionCard] = useState(null);
  const location = useLocation();
  const state = location.state || {};

  const handleActionUUIDChange = (event) => {
    setActionUUID(event.target.value);
  };

  const handleActionCardChange = (event) => {
    setActionCard(event.target.value);
  };

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

  useEffect(() => {
    if (location.state) {
      socket.emit('getPlayer', location.state.roomCode, location.state.uuid);
    }
  }, [location.state]);

  const handleReturnPlayer = (player) => {
    setPlayer(player);
  };

  socket.on('returnPlayer', handleReturnPlayer);

  return (
    <Container>
      <Text>Socket state: {message}</Text>
      {state.uuid ? '' : <Navigate to='/DummyJoin' replace />}
      {player ? (
        <Stack spacing={3}>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={3}>
                <Heading size='lg'>Player: {player.nickname}</Heading>
                <Box>
                  <Text size='sm'>UUID: {player.uuid}</Text>
                  <Text size='sm'>Hand: {JSON.stringify(player.hand)}</Text>
                  <Text size='sm'>Hand Size: {player.handSize}</Text>
                  <Text size='sm'>Pile: {JSON.stringify(player.pile)}</Text>
                  <Text size='sm'>Pile Size: {player.pileSize}</Text>
                  <Text size='sm'>Socket: {player.socketId}</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={3}>
                <Heading size='lg'>Game Actions</Heading>
                <Box>
                  <Heading size='md'>Send Card to Player</Heading>
                  <Text>Player UUID:</Text>{' '}
                  <Input
                    value={actionUUID}
                    onChange={handleActionUUIDChange}
                    placeholder='23456'
                    size='sm'
                  />
                  <Text>Card (1-8):</Text>{' '}
                  <Input
                    value={actionCard}
                    onChange={handleActionCardChange}
                    placeholder='1'
                    size='sm'
                  />{' '}
                  <Button>Send</Button>
                  {/* This should call a socket function in the server that adds the card to a hand and then sends updates to the relevant players
                  AND to the host.*/}
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      ) : (
        `GameRoom ${state.roomCode} or Player UUID ${state.uuid} does not exist.`
      )}
    </Container>
  );
};

export default DummyPlayPage;
