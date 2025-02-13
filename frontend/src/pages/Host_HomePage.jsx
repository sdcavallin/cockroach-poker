import { useState } from "react";
import { Box, Image, Text, Grid, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import FlippingCard from "./FlippingCard.jsx";
import { Link } from "react-router-dom";


const StartBoard = () => {
  return (
    <Box //  Background
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="#c9cba3"
      bgImage={"/images/spiral_tree.png"}
    >
      <Box // Gameboard
        width="1000px"
        height="700px"
        bg="#a44a3f"
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
      >
        {/* Cockroach Poker Title */}
        <Text position="absolute" 
          top={1} 
          left={3} 
          fontSize={30}
          fontWeight="bold">
          Cockroach Poker
        </Text>

        {/* Main Game Area */}
        <Box 
          position="absolute"
          top={14}
          left={10}
          width="800px"
          height="450px"
          bg="#faf3dd"
          borderRadius="md"
          boxShadow="md"
        >
          <Button
            as={Link} 
            to="/gameboard"
            width="20%"
            bg="black"
            color="white"
            fontSize="xl"
            position="absolute"
            bottom="10px"
            left="50%"
            transform="translateX(-50%)" 
            _hover={{ bg: "#d00000" }}
          >
            Start Game
          </Button>
        </Box>


        {/* Room Code */}
        <Text 
          position="absolute"
          top="300px"
          left="200px"
          fontSize="2xl" 
          fontWeight="bold" mt={4}>
          room code: SKD33
        </Text>

        {/* Bottom Cards */}
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={10}
          position="absolute"
          bottom="10px"
          left="20px" 
          width="500px"
        >
          <FlippingCard frontColor="#606c38" backColor="#283618" />
          <FlippingCard frontColor="#283618" backColor="#606c38" />
          <FlippingCard frontColor="#a3b18a" backColor="#344e41" />
          <FlippingCard frontColor="#344e41" backColor="#a3b18a" />
          <FlippingCard frontColor="#606c38" backColor="#344e41" />
        </Grid>

        {/* Side Cards */}
        <Grid
          templateRows="repeat(4, 1fr)"
          gap={3}
          position="absolute"
          right={4}
          height="150px"
        >
          <FlippingCard frontColor="#606c38" backColor="#283618" width="120px" height="160px" />
          <FlippingCard frontColor="#344e41" backColor="#a3b18a" width="120px" height="160px" />
          <FlippingCard frontColor="#606c38" backColor="#344e41" width="120px" height="160px" />
          <FlippingCard frontColor="#a3b18a" backColor="#283618" width="120px" height="160px" />
        </Grid>
      </Box>
    </Box>
  );
};

export default StartBoard;
