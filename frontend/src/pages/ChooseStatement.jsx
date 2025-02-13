import { Box, Button, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";



const ChooseStatementPage = () => {

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
        <Text // Cockroach Poker Box Background 
            position="absolute"
            top="20px"
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
        Choose a Statement
        </Text>

        <Box> 
        {/* This is a ... Box */}
            <Text
                position="absolute"
                top="120px"
                left="115px"
                fontSize="12px"
                fontWeight="bold"
                textAlign="center"
                mb={6}
                bg="#f4f1de"
                p={4}
                borderRadius="md"
                color="red.700"
            >
                This is a...
            </Text>
        </Box>

        {/* Scrollable Cards Section */}
        <Box    
            position="absolute"
            top="200px"
            width="250px"
            height="400px"
            overflowY="scroll"
            borderRadius="md"
            p={3}
            boxShadow="md"
        >
          {/* Stacked Buttons */}
        {Array.from({ length: 8 }).map((_, index) => (
            <Button
                as={Link}
                to="/choosecard"
                key={index}
                width="100%"
                height="60px"
                bg={index % 2 === 0 ? "gray.300" : "gray.400"}
                borderRadius="md"
                mb={3}
                fontSize="lg"
                fontWeight="bold"
                _hover={{ bg: "gray.500" }}
                onClick={() => alert(`You selected Card ${index + 1}`)}
            >
                Card {index + 1}
            </Button>
            ))}
        </Box>
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

export default ChooseStatementPage;
