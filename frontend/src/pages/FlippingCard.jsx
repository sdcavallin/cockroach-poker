import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const FlippingCard = ({ frontColor, backColor }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <MotionBox
      width="120px"
      height="160px"
      borderRadius="md"
      position="relative"
      cursor="pointer"
      onClick={() => setIsFlipped(!isFlipped)} 
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }} 
      transformStyle="preserve-3d"
    >
      {/* Card Front */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        bg={frontColor}
        borderRadius="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backfaceVisibility="hidden"
      >
        Front
      </Box>

      {/* Card Back */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        bg={backColor}
        borderRadius="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        transform="rotateY(180deg)"
        backfaceVisibility="hidden"
      >
        Back
      </Box>
    </MotionBox>
  );
};

export default FlippingCard;
