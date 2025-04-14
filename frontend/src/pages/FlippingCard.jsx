import { useState } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const FlippingCard = ({
  frontColor = '#F4A261',
  backImage = '/cards/back.png',
  isFlipped = false,
  width = '100px',
  height = '150px',
}) => {
  return (
    <Box
      width={width}
      height={height}
      borderRadius="md"
      boxShadow="md"
      overflow="hidden"
      bg={frontColor}
      display="flex"
      justifyContent="center"
      alignItems="center"
      transform={isFlipped ? 'rotateY(180deg)' : 'none'}
      transition="transform 0.4s"
    >
      {/* BACK */}
      {!isFlipped && (
        <Image
          src={backImage}
          alt="Card Back"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      )}

      {/* FRONT (placeholder) */}
      {isFlipped && (
        <Text color="white" fontWeight="bold">
          Flipped! 
        </Text>
      )}
    </Box>
  );
};

export default FlippingCard;
