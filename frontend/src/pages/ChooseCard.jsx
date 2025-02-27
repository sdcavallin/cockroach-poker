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
      p={['5%', '8%']} // Padding based on viewport size
    >
      {/* Layout Switch: Desktop // Mobile Version */}
      <VStack
        spacing={['5%', '6%']}
        width={isDesktop ? '80%' : '100%'}
        alignItems='center'
      >
        {/* Phone Screen Box */}
        <Box
          width={isDesktop ? '60%' : '90%'} // Width based on percentage
          height={isDesktop ? '60%' : '70%'} // Height based on percentage
          aspectRatio={isDesktop ? 1 : undefined}
          bg='#F4A261'
          border='2px solid #2A9D8F'
          borderRadius='md'
          boxShadow='lg'
          position='relative'
          display='flex'
          flexDirection='column'
          alignItems='center'
          p='5%' // Padding in percentage
          overflow='hidden'
        >
          <Box
            position='absolute'
            top='1%'
            left={isDesktop ? '-20%' : '-30%'} // Adjusted left for positioning
            width={isDesktop ? '60%' : '80%'}
            height='auto'
            zIndex='-2'
          ></Box>

          {/* Title */}
          <Text
            fontSize={['5vw', '6vw', '28px']} // Font size in viewport width
            fontWeight='bold'
            textAlign='center'
            mb='5%' // Margin in percentage
            bg='#f4f1de'
            p='5%' // Padding in percentage
            borderRadius='md'
            color='#264653'
            width='90%'
          >
            Choose a Card
          </Text>

          {/* Scrollable Cards Section */}
          <Box
            width='90%' // Width based on percentage of the parent container
            height={['40%', '50%']} // Height based on percentage of the container
            overflowY='scroll'
            borderRadius='md'
            p='5%' // Padding in percentage
          >
            {/* Stacked Buttons */}
            {Array.from({ length: 8 }).map((_, index) => (
              <Button
                as={Link}
                to='/choosestatement'
                key={index}
                width='100%' // Full width based on container size
                height='10%' // Height based on percentage of container height
                bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
                borderRadius='md'
                mb='3%' // Margin between buttons in percentage
                fontSize='4vw' // Font size in viewport width units
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
          bottom={['-10%', '-15%', '-20%']} // Positioned based on percentage
          right={isDesktop ? '15%' : '5%'} // Adjusted right for positioning
        ></Box>
      </VStack>
    </Box>
  );
};

export default ChooseCardPage;
