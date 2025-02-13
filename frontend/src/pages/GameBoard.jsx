import { Box, Image, Text, Grid, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import FlippingCard from "./FlippingCard.jsx";
import { Link } from "react-router-dom";

const GameBoard = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg="black"
        >
            {/* Outer Game Border (Red Game Mat) */}
            <Box 
                width="1000px"
                height="700px"
                bg="#780000"
                p={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                position="relative"
            >
                {/* Main Game Area (White Game Board Box) */}
                <Box 
                    width="900px"
                    height="600px"
                    bg="#faf3dd"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >  
                    {/* Centered Title Inside the White Box */}
                    <Text
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        fontSize="50px"
                        fontWeight="bold"
                        color="#780000"
                        textAlign="center"
                        opacity={0.2}
                    >
                        Cockroach Poker
                    </Text>
                
                    <Grid // Bottom Left Grid
                        templateColumns="repeat(2, 1fr)" 
                        templateRows="repeat(4, 1fr)" 
                        gap={1} 
                        width="10px" 
                        height="20px"
                        position="absolute" 
                        left="130px"
                        bottom="220px" 
                        >
                        {/* Generate 8 boxes dynamically */}
                        {[...Array(8)].map((_, index) => (
                            <Box
                            key={index}
                            width="30px"
                            height="50px"
                            bg={index === 6 ? "#5b7553" : "gray.200"} 
                            borderRadius="md"
                            />
                        ))}
                    </Grid>

                    <Grid // Top Left Grid
                        templateColumns="repeat(2, 1fr)" 
                        templateRows="repeat(4, 1fr)"
                        gap={1} 
                        width="10px" 
                        height="20px" 
                        position="absolute" 
                        left="130px"
                        top="20px" 
                        >
                        {/* Generate 8 boxes dynamically */}
                        {[...Array(8)].map((_, index) => (
                            <Box
                            key={index}
                            width="30px"
                            height="50px"
                            bg={index === 1 ? "#70ae6e" : "gray.200"} 
                            borderRadius="md"
                            />
                        ))}
                    </Grid>

                    <Grid // Bottom Right Grid
                        templateColumns="repeat(2, 1fr)" 
                        templateRows="repeat(4, 1fr)" 
                        gap={1} 
                        width="10px" 
                        height="20px"
                        position="absolute" 
                        right="190px"
                        bottom="220px"
                        >
                        {/* Generate 8 boxes */}
                        {[...Array(8)].map((_, index) => (
                            <Box
                            key={index}
                            width="30px"
                            height="50px"
                            bg={index === 4 ? "#d4e09b" : "gray.200"} 
                            borderRadius="md"
                            />
                        ))}
                    </Grid>

                    <Grid // Top Right Grid
                        templateColumns="repeat(2, 1fr)"
                        templateRows="repeat(4, 1fr)" 
                        gap={1} 
                        width="10px" 
                        height="20px" 
                        position="absolute" 
                        right="190px"
                        top="20px" 
                        >
                        {/* Generate 8 boxes dynamically */}
                        {[...Array(8)].map((_, index) => (
                            <Box
                            key={index}
                            width="30px"
                            height="50px"
                            bg={index === 5 ? "#9cb380" : "gray.200"} // Make one purple
                            borderRadius="md"
                            />
                        ))}
                    </Grid>

                    <Image // Bat Image
                        position="absolute"
                        src="images/bat_silhouette.png"
                        width={"80px"}
                        left="10px"
                        bottom="10px"
                    Image/>

                    <Image // Toad Image
                        position="absolute"
                        src="images/toad_silhouette.png"
                        width="80px"
                        right="10px"
                        top="10px"
                    Image/>

                    <Image // Cockraoch Image
                        position="absolute"
                        src="images/cockroach_silhouette.png"
                        width="80px"
                        left="10px"
                        top="10px"
                    Image/>

                    <Image // Rat Image
                        position="absolute"
                        src="images/rat_silhouette.png"
                        width="90px"
                        right="10px"
                        bottom="20px"
                        transform="scaleX(-1)"
                    Image/>
                </Box>
            </Box>
        </Box>
    );
};

export default GameBoard;
