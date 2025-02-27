import { Box, Button, Text, Image, useMediaQuery } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ChoosePlayerPage = () => {
  const [isDesktop] = useMediaQuery('(min-width: 768px)'); // Detect desktop & when to switch

  return (
    <Box
      width='100vw'
      height='100vh'
      bg='#E9C46A'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      overflow='hidden'
      p={['5%', '8%']} // Padding in percentage
    >
      {/* Responsive Square Background Box */}
      <Box
        width={isDesktop ? '60%' : '90%'}
        height={isDesktop ? '60%' : '70%'} // Square on desktop, taller on mobile
        bg='#F4A261'
        border='2px solid #2A9D8F'
        borderRadius='md'
        position='relative'
        display='flex'
        flexDirection='column'
        alignItems='center'
        p='5%' // Padding in percentage
        overflow='hidden'
      >
        {/* Tree Silhouette */}
        <Box
          position='absolute'
          top='1%' // Adjusted top as percentage
          left={isDesktop ? '-20%' : '-30%'} // Position based on screen size
          width={isDesktop ? '60%' : '80%'} // Width based on screen size
          height='auto'
          zIndex='-2'
        ></Box>

        {/* Title */}
        <Text
          fontSize={['5vw', '6vw', '28px']} // Font size relative to viewport width
          fontWeight='bold'
          textAlign='center'
          bg='#f4f1de'
          p='5%' // Padding in percentage
          borderRadius='md'
          color='#264653'
          width='80%' // Width based on percentage
          mt={['2%', '4%']} // Margin in percentage
        >
          Choose a Player
        </Text>

        {/* Clickable Image Link */}
        <Link to='/choosestatement'>
          <Image
            src='/images/rat_silhouette.png'
            width={isDesktop ? '50%' : '70%'} // Width based on screen size
            mt={['5%', '8%']} // Margin in percentage
            cursor='pointer'
            _hover={{
              transform: 'scale(1.1)',
              transition: '0.3s ease-in-out',
            }}
          />
        </Link>
      </Box>

      {/* Overlapping Cards */}
      <Box
        position='absolute'
        bottom={['-10%', '-15%', '-20%']} // Positioned based on percentage of container height
        right={isDesktop ? '10%' : '5%'} // Adjusted right for positioning in percentage
      ></Box>
    </Box>
  );
};

export default ChoosePlayerPage;
