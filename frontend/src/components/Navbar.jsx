import { Box, HStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Box bg='blue.500' p={4} color='white'>
      <HStack spacing={4} justify='center'>
        <Button as={Link} to='/' colorScheme='teal' variant='solid'>
          Home
        </Button>
        <Button as={Link} to='/host' colorScheme='teal' variant='solid'>
          Host
        </Button>
        <Button as={Link} to='/player' colorScheme='teal' variant='solid'>
          Player
        </Button>
        <Button as={Link} to='/gameboard' colorScheme='teal' varant='solid'>
          Gameboard
        </Button>
        <Button as={Link} to='/chooseplayer' colorScheme='teal' varant='solid'>
          ChoosePlayer
        </Button>
        <Button as={Link} to='/choosecard' colorScheme='teal' varant='solid'>
          ChooseCard
        </Button>
        <Button
          as={Link}
          to='/choosestatement'
          colorScheme='teal'
          varant='solid'
        >
          ChooseStatement
        </Button>
        <Button as={Link} to='/dummyplayer' colorScheme='teal' varant='solid'>
          DummyPlayer
        </Button>
      </HStack>
    </Box>
  );
}

export default Navbar;
