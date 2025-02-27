import {
  Box,
  Button,
  Text,
  Image,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ChooseStatementPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)'); // Detect desktop

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A' // Background color
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={['5%', '8%']} // Padding based on viewport size
    >
      {/* Responsive Square Box */}
      <Box
        width={isDesktop ? '60%' : '90%'} // 60% on desktop, 90% on mobile
        height={isDesktop ? '60%' : '70%'} // Maintain large square on desktop, tall on mobile
        aspectRatio={isDesktop ? 1 : undefined} // Ensure it's square on larger screens
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
        {/* Tree Silhouette */}
        <Box
          position='relative'
          top='1%'
          left={isDesktop ? '-20%' : '-30%'} // Adjusted left for positioning
          width={isDesktop ? '60%' : '80%'}
          height='auto'
          zIndex='-2'
        ></Box>

        {/* Title */}
        <Text
          position='relative'
          top={['5%', '8%']} // Adjust position in percentage
          fontSize={['6vw', '8vw', '28px']} // Font size in viewport width
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='5%' // Padding based on percentage
          borderRadius='md'
          boxShadow='md'
          color='#264653'
          width='80%' // Width based on percentage
        >
          Choose a Statement
        </Text>

        {/* "This is a..." Text */}
        <Text
          position='relative'
          top={['15%', '18%']}
          left='50%'
          transform='translateX(-50%)'
          fontSize={['4vw', '5vw']} // Font size based on viewport width
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='3%' // Padding in percentage
          borderRadius='md'
          color='#264653'
          width='50%' // Width based on percentage
        >
          This is a...
        </Text>

        {/* Scrollable Cards Section */}
        <Box
          width='90%' // Width based on percentage of the parent container
          height={['40%', '50%']} // Height based on percentage of the container
          overflowY='scroll'
          p='5%' // Padding in percentage
          position='relative'
          top={['20%', '25%']} // Adjust top in percentage for positioning
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Button
              as={Link}
              to='/choosecard'
              key={index}
              width='100%' // Full width based on container size
              height='10%' // Height based on percentage of container height
              bg={index % 2 === 0 ? 'gray.300' : 'gray.400'}
              borderRadius='md'
              mb='5%' // Margin between buttons in percentage
              fontSize='4vw' // Font size based on viewport width units
              fontWeight='bold'
              _hover={{ bg: '#2A9D8F' }}
              onClick={() => alert(`You selected Card ${index + 1}`)}
            >
              Card {index + 1}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Overlapping Cards Image */}
      <Box
        position='relative'
        bottom={['-10%', '-15%', '-20%']} // Positioned based on percentage
        right={isDesktop ? '10%' : '5%'} // Adjusted right for positioning
      ></Box>
    </Box>
  );
};

export default ChooseStatementPage;
