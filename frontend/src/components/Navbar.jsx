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
        <Button as={Link} to='/Host' colorScheme='teal' variant='solid'>
          Host
        </Button>
        <Button as={Link} to='/Player' colorScheme='teal' variant='solid'>
          Player
        </Button>
        <Button as={Link} to='/Gameboard' colorScheme='teal' variant='solid'>
          Gameboard
        </Button>
        <Button as={Link} to='/ChoosePlayer' colorScheme='teal' variant='solid'>
          ChoosePlayer
        </Button>
        <Button as={Link} to='/ChooseAvatar' colorScheme='teal' variant='solid'>
          ChooseAvatar
        </Button>
        <Button as={Link} to='/ChooseUName' colorScheme='teal' variant='solid'>
          ChooseUName
        </Button>
        <Button as={Link} to='/ChooseCard' colorScheme='teal' variant='solid'>
          ChooseCard
        </Button>
        <Button as={Link} to='/JoinRoom' colorScheme='teal' variant='solid'>
          ChooseCard
        </Button>
        <Button
          as={Link}
          to='/ChooseStatement'
          colorScheme='teal'
          variant='solid'
        >
          ChooseStatement
        </Button>
        <Button as={Link} to='/DummyPlayer' colorScheme='teal' variant='solid'>
          DummyPlayer
        </Button>
        <Button as={Link} to='/DummyHost' colorScheme='teal' variant='solid'>
          DummyHost
        </Button>
        <Button as={Link} to='/DummyJoin' colorScheme='teal' variant='solid'>
          DummyJoin
        </Button>
        <Button as={Link} to='/DummyPlay' colorScheme='teal' variant='solid'>
          DummyPlay
        </Button>
      </HStack>
    </Box>
  );
}

export default Navbar;
