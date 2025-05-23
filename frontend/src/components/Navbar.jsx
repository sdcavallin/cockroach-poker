import {
  Box,
  Button,
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
    { to: '/', label: 'Play!' },
    { to: '/join', label: 'Join a Game' },
    { to: '/rejoinhost', label: 'Host Rejoin' },
    { to: '/credits', label: 'Credits' },
  ];

  return (
    <Box position='absolute' top={4} left={4} zIndex={1000}>
      {/* Always show hamburger icon */}
      <IconButton
        icon={<HamburgerIcon />}
        aria-label='Open menu'
        onClick={onOpen}
        bg='yellow.300'
        color='white'
        _hover={{ bg: 'blue.600' }}
      />

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg='yellow.500' color='white'>
          <DrawerCloseButton />
          <DrawerHeader>Cockroach Poker</DrawerHeader>
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
