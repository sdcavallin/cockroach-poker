import {
  Box,
  Button,
  Text,
  Image,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ChooseCardPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)'); // Detect desktop

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A' // Light red-orange background
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={[2, 4]}
    >
      {/* Layout Switch: Desktop // Mobile Version */}
      <VStack
        spacing={6}
        width={isDesktop ? '80%' : '100%'}
        alignItems='center'
      >
        {/* Phone Screen Box */}
        <Box
          width={isDesktop ? '600px' : '90%'} // 600px on desktop, 90% on mobile
          height={isDesktop ? '600px' : '700px'}
          aspectRatio={isDesktop ? 1 : undefined}
          bg='#F4A261'
          border='2px solid #2A9D8F'
          borderRadius='md'
          boxShadow='lg'
          position='relative'
          display='flex'
          flexDirection='column'
          alignItems='center'
          p={6}
          overflow='hidden'
        >
          <Box
            position='absolute'
            top='1'
            left={['-100px', '-200px']}
            width={['750', '750px']}
            height='auto'
            zIndex='-2'
          ></Box>

          {/* Title */}
          <Text
            fontSize={['xl', '2xl', '28px']}
            fontWeight='bold'
            textAlign='center'
            mb={6}
            bg='#f4f1de'
            p={4}
            borderRadius='md'
            color='#264653'
            width='90%'
          >
            Choose a Card
          </Text>

          {/* Scrollable Cards Section */}
          <Box
            width={['90%', '250px']}
            height={['300px', '400px']}
            overflowY='scroll'
            borderRadius='md'
            p={3}
          >
            {/* Stacked Buttons */}
            {Array.from({ length: 8 }).map((_, index) => (
              <Button
                as={Link}
                to='/choosestatement'
                key={index}
                width='100%'
                height='60px'
                bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
                borderRadius='md'
                mb={3}
                fontSize='lg'
                fontWeight='bold'
                _hover={{ bg: '#2A9D8F' }}
                onClick={() => alert(`You selected Card ${index + 1}`)}
              >
                Card {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          position='absolute'
          bottom={['-20px', '-50px', '-130px']}
          right={isDesktop ? '350px' : '10px'}
        ></Box>
      </VStack>
    </Box>
  );
};

export default ChooseCardPage;
