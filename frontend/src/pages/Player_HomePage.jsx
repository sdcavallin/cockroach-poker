import { Box, Button, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";



const LandingPage = () => {

  console.log("Image Path:", window.location.origin + "/images/cards.png");

  return (
    <Box // Light Green BG
      width="100vw"
      height="100vh"
      bg="#c9cba3" 
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* Main Area */}
      <Box // Red `Phone Screen
        width="323px"
        height="700px"
        zIndex={0}
        bg="#780000"  
        border="2px white"        
        borderRadius="md"
        boxShadow="lg"
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={6}
        overflow="hidden"
      >
        {/* Tree Silhouette Inside Phone Screen */}
        <Box position="absolute" top="1" left="-200px" width="1200px" height="1000px" zIndex="-2"> 
          <Image
            transform="rotate(15deg)"
            src="/images/spiral_tree.png"
            alt="Creepy Tree"
            width="750px"
            height="auto"
            objectFit="contain" 
            opacity={0.5}
          />
        </Box>

        {/* Title */}
        <Text // Cockroach Poker Box Background 
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          mb={6}
          bg="#f4f1de"
          p={4}
          borderRadius="md"
          boxShadow="md"
          color="red.700"
        >
          COCKROACH <br /> POKER
        </Text>

        {/* Create & Join Buttons */}
        <Button
          as={Link} 
          to="/host"
          width="80%"
          bg="#f4f1de"
          fontSize="2xl"
          mb={4}
          _hover={{ bg: "#d00000" }}
        >
          CREATE
        </Button>

        <Button
          as={Link}
          width="80%"
          bg="#f4f1de"
          fontSize="2xl"
          _hover={{ bg: "#7ae582" }}
        >
          JOIN
        </Button>

        
      </Box>
      {/* Overlapping Cards */}
      <Box position="absolute" bottom="-130px" right="350px"> 
          <Image 
            transform="rotate(20deg)"
            src="/images/cards.png"
            alt="Cards"
            width="200"
          />
        </Box>
    </Box>
  );
};

export default LandingPage;
