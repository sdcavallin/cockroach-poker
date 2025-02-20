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
      bg="#264653"
    >
      <Box // Gameboard
        width="1000px"
        height="700px"
        bg="#2A9D8F"
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
          color="#264653"
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
          bg="#F4A261"
          borderRadius="md"
          boxShadow="md"
        >
          <Button
            as={Link} 
            to="/gameboard"
            width="20%"
            bg="#E9C46A"
            color="#264653"
            fontSize="xl"
            position="absolute"
            bottom="10px"
            left="50%"
            transform="translateX(-50%)" 
            _hover={{ bg: "#E76F51" }}
          >
            Start Game
          </Button>
        </Box>


        {/* Room Code */}
        <Text 
          position="absolute"
          top="300px"
          left="200px"
          fontSize="52px" 
          color="#264653"
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
          <FlippingCard frontColor="#E9C46A" backColor="#F4A261" />
          <FlippingCard frontColor="#F4A261" backColor="#E9C46A" />
          <FlippingCard frontColor="#E9C46A" backColor="#F4A261" />
          <FlippingCard frontColor="#F4A261" backColor="#E9C46A" />
          <FlippingCard frontColor="#E9C46A" backColor="#F4A261" />
        </Grid>

        {/* Side Cards */}
        <Grid
          templateRows="repeat(4, 1fr)"
          gap={3}
          position="absolute"
          right={4}
          height="150px"
        >
          <FlippingCard frontColor="#F4A261" backColor="#E9C46A" width="120px" height="160px" />
          <FlippingCard frontColor="#E9C46A" backColor="#F4A261" width="120px" height="160px" />
          <FlippingCard frontColor="#F4A261" backColor="#E9C46A" width="120px" height="160px" />
          <FlippingCard frontColor="#a3b18a" backColor="#F4A261" width="120px" height="160px" />
        </Grid>
      </Box>
    </Box>
  );
};

export default StartBoard;
