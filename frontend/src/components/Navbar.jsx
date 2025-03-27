import {
  Box,
  Button,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/host', label: 'Host' },
    { to: '/player', label: 'Player' },
    { to: '/gameboard', label: 'Gameboard' },
    { to: '/chooseplayer', label: 'ChoosePlayer' },
    { to: '/chooseavatar', label: 'ChooseAvatar' },
    { to: '/chooseuname', label: 'ChooseUName' },
    { to: '/choosecard', label: 'ChooseCard' },
    { to: '/joinroom', label: 'JoinRoom' },
    { to: '/choosestatement', label: 'ChooseStatement' },
    { to: '/dummyplayer', label: 'DummyPlayer' },
    { to: '/dummyhost', label: 'DummyHost' },
  ];

  return (
    <Box bg='blue.500' p={4} color='white' width='100%'>
      {/* Hamburger button for small screens */}
      <Box display={{ base: 'block', md: 'none' }}>
        <IconButton
          icon={<HamburgerIcon />}
          aria-label='Open menu'
          onClick={onOpen}
          colorScheme='teal'
        />
      </Box>

      {/* Horizontal navbar for medium+ screens */}
      <HStack
        spacing={4}
        justify='center'
        display={{ base: 'none', md: 'flex' }}
        mt={{ base: 0, md: 2 }}
      >
        {navLinks.map((link) => (
          <Button
            as={Link}
            to={link.to}
            key={link.to}
            colorScheme='teal'
            variant='solid'
          >
            {link.label}
          </Button>
        ))}
      </HStack>

      {/* Drawer for mobile menu */}
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg='blue.500' color='white'>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack align='start' spacing={4}>
              {navLinks.map((link) => (
                <Button
                  as={Link}
                  to={link.to}
                  key={link.to}
                  colorScheme='teal'
                  variant='ghost'
                  width='100%'
                  onClick={onClose}
                >
                  {link.label}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Navbar;
