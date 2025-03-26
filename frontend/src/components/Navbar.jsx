import { Box, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <Box
      bg='blue.500'
      p={4}
      color='white'
      overflowX='auto' // Enables horizontal scrolling if needed
      whiteSpace='nowrap' // Prevents text from wrapping inside buttons
      width='100%' // Ensures full width
    >
      <HStack
        spacing={4}
        justify='center'
        flexWrap={{ base: 'wrap', md: 'nowrap' }} // Wraps on small screens, inline on larger
      >
        <Button as={Link} to='/' colorScheme='teal' variant='solid'>
          Home
        </Button>
        <Button as={Link} to='/host' colorScheme='teal' variant='solid'>
          Host
        </Button>
        <Button as={Link} to='/player' colorScheme='teal' variant='solid'>
          Player
        </Button>
        <Button as={Link} to='/gameboard' colorScheme='teal' variant='solid'>
          Gameboard
        </Button>
        <Button as={Link} to='/chooseplayer' colorScheme='teal' variant='solid'>
          ChoosePlayer
        </Button>
        <Button as={Link} to='/chooseavatar' colorScheme='teal' variant='solid'>
          ChooseAvatar
        </Button>
        <Button as={Link} to='/chooseuname' colorScheme='teal' variant='solid'>
          ChooseUName
        </Button>
        <Button as={Link} to='/choosecard' colorScheme='teal' variant='solid'>
          ChooseCard
        </Button>
        <Button as={Link} to='/joinroom' colorScheme='teal' variant='solid'>
          ChooseCard
        </Button>
        <Button
          as={Link}
          to='/choosestatement'
          colorScheme='teal'
          variant='solid'
        >
          ChooseStatement
        </Button>
        <Button as={Link} to='/dummyplayer' colorScheme='teal' variant='solid'>
          DummyPlayer
        </Button>
        <Button as={Link} to='/dummyhost' colorScheme='teal' variant='solid'>
          DummyHost
        </Button>
      </HStack>
    </Box>
  );
}

export default Navbar;
