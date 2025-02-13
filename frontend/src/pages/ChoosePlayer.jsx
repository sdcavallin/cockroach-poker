import { Box, Button, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ChoosePlayerPage = () => {


return (
    <Box // light green background
        width="100vw"
        height="100vh"
        bg="#c9cba3" 
        display="flex"
        justifyContent="center"
        alignItems="center"
    >
      {/* Main Area */}
      <Box // red phone screen
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
        <Text 
            fontSize="28px"
            fontWeight="bold"
            textAlign="center"
            mb={6}
            bg="#f4f1de"
            p={4}
            borderRadius="md"
            boxShadow="md"
            color="red.700"
        >
        Choose a Player
        </Text>

        {/* Clickable Image Link */}
        <Link to="/choosestatement">
            <Image
                src="/images/rat_silhouette.png"
                width="80%"
                cursor="pointer" // Ensures pointer cursor on hover
                _hover={{ transform: "scale(1.1)", transition: "0.3s ease-in-out" }} // Hover effect
            />
        </Link>        
    </Box>

        {/* Overlapping Cards */}
        <Box position="absolute" bottom="-130px" right="350px"> 
            <Image 
                transform="rotate(20deg)"
                src="/images/cards.png"
                alt="Cards"
                width="200"
                opacity={0.2}
            />
        </Box>
    </Box>
);
};

export default ChoosePlayerPage;
