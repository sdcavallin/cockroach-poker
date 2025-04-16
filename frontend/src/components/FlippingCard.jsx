import { Box, Image, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const FlippingCard = ({
  isFlipped = false,
  backImage = '/cards/back.png',
  frontContent = null,
  width = '100px',
  height = '150px',
}) => {
  return (
    <Box width={width} height={height} perspective='1000px'>
      <MotionBox
        position='relative'
        width='100%'
        height='100%'
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Back Side */}
        <Box
          position='absolute'
          width='100%'
          height='100%'
          sx={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={backImage}
            alt='Card Back'
            objectFit='cover'
            width='100%'
            height='100%'
            borderRadius='md'
          />
        </Box>

        {/* Front Side */}
        <Box
          position='absolute'
          width='100%'
          height='100%'
          sx={{ backfaceVisibility: 'hidden' }}
          transform='rotateY(180deg)'
          bg='#F4A261'
          borderRadius='md'
          border='4px solid black'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {frontContent}
        </Box>
      </MotionBox>
    </Box>
  );
};

export default FlippingCard;
