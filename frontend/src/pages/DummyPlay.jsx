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
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useState, useEffect, state } from 'react';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5000', {
  autoConnect: false,
});

const DummyPlayPage = () => {
  const [message, setMessage] = useState('Connecting socket...');
  const [player, setPlayer] = useState(null);
  const [actionUUID, setActionUUID] = useState(null);
  const [actionCard, setActionCard] = useState(null);
  const [actionClaim, setActionClaim] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const handleActionUUIDChange = (event) => {
    setActionUUID(event.target.value);
  };

  const handleActionCardChange = (event) => {
    setActionCard(event.target.value);
  };

  const handleActionClaimChange = (event) => {
    setActionClaim(event.target.value);
  };

  const handleSendCard = () => {
    console.log(`Handle Send Card Run`);
    if (!player?.uuid || !actionUUID || !actionCard || !actionClaim) {
      console.warn('Tried to send card but missing data:', {
        sender: player?.uuid,
        receiver: actionUUID,
        card: actionCard,
        claim: actionClaim,
      });
      console.log(`Handle Send Card Failed`);
      return;
    }
    if (!socketReady) {
      console.log('Socket not ready');
      return;
    }
    socket.emit(
      'initPlayerSendCard',
      player.uuid,
      actionUUID,
      actionCard,
      actionClaim
    );
  };

  // If user entered from PlayerJoin or ReJoin this passes, if not then it fails.

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    } else {
      setMessage(`Connected with id ${socket.id}`);
      setSocketReady(true);
    }

    const handleConnect = () => {
      setMessage(`Connected with id ${socket.id}`);
      setSocketReady(true);

      const roomCode = Cookies.get('roomCode');
      const uuid = Cookies.get('uuid');
      if (roomCode && uuid) {
        socket.emit('getPlayer', roomCode, uuid, socket.id);
      } else {
        console.log(`Player didn't connect properly`);
      }
    };
    //**TODO: PORT OVER CODE THAT CONNECTS SOCKETID TO A GAMEROOM!

    const handleReturnPlayer = (player) => {
      setPlayer(player);
    };

    const handleReceiveCard = ({ claim, conspiracyList }) => {
      console.log(
        `The Claim is ${claim} and the list of other who already have seen the card is ${conspiracyList.join(
          ', '
        )}`
      );
      //TODO: The Player is then prompted to either choose to look at or contest the claim.
      // Simulate prompting the p layer to accept or contest (replace with real UI later)
      const response = window.confirm(
        `Claim: ${claim}\nDo you accept it? Click "Cancel" to contest.`
      );
      if (response) {
        console.log('Player chose to contest the claim!');
        const callBoolean = window.confirm(
          'Do you think the claim is true or false? Click "OK" for true or "Cancel" for false.'
        );

        socket.emit('cardResolution', player.uuid, callBoolean);
      } else {
        socket.emit('playerCheckCard', player.uuid);

        const handleCheckedCard = (card) => {
          console.log(`It turns out the card was actually ${card}`);
          const newClaim = prompt('What is your claim about this card?');

          if (newClaim) {
            socket.emit('playerPassCard', actionUUID, newClaim);
          }

          socket.off('checkedCard', handleCheckedCard);
        };

        socket.on('checkedCard', handleCheckedCard);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('returnPlayer', handleReturnPlayer);
    socket.on('playerReceiveCard', handleReceiveCard);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('returnPlayer', handleReturnPlayer);
      socket.off('playerReceiveCard', handleReceiveCard);
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

  return (
    <Container>
      <Text>Socket state: {message}</Text>
      {state.uuid ? '' : <Navigate to='/dummyjoin' replace />}
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
                  <Text>Claim (1-8):</Text>{' '}
                  <Input
                    value={actionClaim}
                    onChange={handleActionClaimChange}
                    placeholder='1'
                    size='sm'
                  />{' '}
                  <Button onClick={handleSendCard}>Send</Button>
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
