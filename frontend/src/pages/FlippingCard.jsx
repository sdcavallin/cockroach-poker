import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const FlippingCard = ({
  frontColor,
  backColor,
  width = '20%', // Percentage-based width
  height = '30%', // Percentage-based height
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <MotionBox
      width={width} // Use percentage-based width
      height={height} // Use percentage-based height
      borderRadius='md'
      position='relative'
      cursor='pointer'
      onClick={() => setIsFlipped(!isFlipped)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      transformStyle='preserve-3d'
    >
      {/* Card Front */}
      <Box
        position='absolute'
        width='100%' // Take full width
        height='100%' // Take full height
        bg={frontColor}
        borderRadius='md'
        display='flex'
        justifyContent='center'
        alignItems='center'
        backfaceVisibility='hidden'
      >
        Front
      </Box>

      {/* Card Back */}
      <Box
        position='absolute'
        width='100%' // Take full width
        height='100%' // Take full height
        bg={backColor}
        borderRadius='md'
        display='flex'
        justifyContent='center'
        alignItems='center'
        transform='rotateY(180deg)'
        backfaceVisibility='hidden'
      >
        Back
      </Box>
    </MotionBox>
  );
};

export default FlippingCard;
