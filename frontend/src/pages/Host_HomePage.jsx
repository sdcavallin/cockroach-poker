import { useEffect, useState } from "react";
import { Box, Image, Text, Grid, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import FlippingCard from "./FlippingCard.jsx";
import { Link } from "react-router-dom";


const StartBoard = () => {

  const [players, setNumPlayers] = useState([]); // Array of player objects from backend 
  const [loading, setIsLoading] = useState(true); // Loading state for fetching data  
  const [error, setError] = useState(null); // Error state for fetching data  

  useEffect(() => {
    const fetchPlayers = async () => {
      try { 
        const response = await fetch("http://localhost:5000/players"); // API key here I think 
        const data = await response.json();

        if (data.success) {
          setNumPlayers(data.players);
        } else {
          setError(data.error);
        }
      }
      catch (error) {
        setError(error);
      }
      finally {
        setIsLoading(false);
      } 
    };
  
    fetchPlayers();

    const interval = setInterval(fetchPlayers, 5000);

    return () => clearInterval(interval);
  }, []);

  const playerCount = players.length;


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

        {/* Bottom Cards - Flips based on player count */}
        <Grid templateColumns="repeat(5, 1fr)" gap={10} position="absolute" bottom="10px" left="20px" width="500px">
          {[...Array(5)].map((_, index) => (
            <FlippingCard
              key={index}
              frontColor="#E9C46A"
              backColor="#F4A261"
              isFlipped={index < playerCount} // Flip based on player count
            />
          ))}
        </Grid>

        {/* Side Cards - Flips based on player count */}
        <Grid templateRows="repeat(4, 1fr)" gap={3} position="absolute" right={4} height="150px">
          {[...Array(4)].map((_, index) => (
            <FlippingCard
              key={index + 5} // Ensure unique keys
              frontColor={index === 3 ? "#a3b18a" : "#F4A261"}
              backColor={index % 2 === 0 ? "#E9C46A" : "#F4A261"}
              isFlipped={index + 5 < playerCount} // Flip based on player count
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default StartBoard;