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
          sx={{
            backfaceVisibility: 'hidden',
          }}
          transform='rotateY(180deg)'
          //bg='#F4A261'
          //background='radial-gradient(circle, #FFD1FF, #FBC02D)'
          background-size='100% 100%;'
          background-position='0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px;'
          background='radial-gradient(75% 75% at 11% 89%, #8422DDFF 0%, #0B0B0B00 40%),radial-gradient(75% 75% at 11% 52%, #2292DDFF 0%, #0B0B0B00 61%),radial-gradient(75% 75% at 18% 11%, #22DDA4FF 0%, #0B0B0B00 60%),radial-gradient(75% 75% at 53% 26%, #5A8209FF 0%, #0B0B0B00 70%),radial-gradient(75% 75% at 71% 23%, #E8BB0DFF 0%, #0B0B0B00 80%),radial-gradient(75% 75% at 91% 54%, #E85E0DFF 0%, #0B0B0B00 90%),radial-gradient(75% 75% at 91% 78%, #E80D34FF 0%, #0B0B0B00 100%),radial-gradient(75% 75% at 63% 100%, #FFFFFFFF 0%, #FFFFFFFF 44%, #0B0B0B00 99%),radial-gradient(75% 75% at 54% 50%, #070707FF 0%, #0B0B0B00 100%);'
          borderRadius='md'
          border='5px solid black'
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
