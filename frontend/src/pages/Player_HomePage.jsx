import { Box, Button, Text, Image, VStack, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";

const LandingPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)"); // Switch at 768px

  return (
    <Box
      width="100vw"
      height="100vh"
      bg="#2A9D8F" // teal background for the landing page
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      overflow="hidden"
      p={[2, 4]}
    >
      {isDesktop ? (
        // Big Layout for Desktop
        <HStack
          spacing={10}
          width="80%"
          height="80vh"
          justifyContent="center"
          alignItems="center"
        >
          {/* Phone Screen Box */}
          <Box
            width="700px"
            height="700px"
            bg="#F4A261"
            border="2px solid #E9C46A"
            borderRadius="md"
            boxShadow="lg"
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={6}
            overflow="hidden"
          >
            {/* Title */}
            <Text
              fontSize="4xl"
              fontWeight="bold"
              textAlign="center"
              mb={6}
              p={4}
              borderRadius="md"
              color="#264653"
              width="90%"
            >
              COCKROACH <br /> POKER
            </Text>

            {/* Create & Join Buttons */}
            <Button as={Link} to="/host" width="80%" fontSize="2xl" mb={4} color="#264653" bg="#E9C46A">
              CREATE
            </Button>
            <Button as={Link} to="/host" width="80%" fontSize="2xl" mb={4} color="#264653" bg="#E9C46A">
              JOIN
            </Button>
          </Box>

          {/* Cards Image on Desktop */}
          <Image
            src="/images/cards.png"
            alt="Cards"
            width="250px"
            transform="rotate(20deg)"
            position="relative"
          />
        </HStack>
      ) : (
        // Small Layout for Mobile
        <VStack spacing={6}>
          {/* Title */}
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            bg="#F4A261" 
            p={4}
            borderRadius="md"
            color="#264653"
            >
            COCKROACH <br /> POKER
          </Text>

          {/* Create & Join Buttons */}
          <Button as={Link} to="/host" width="90%" fontSize="xl">
            CREATE
          </Button>
          <Button width="90%" fontSize="xl">
            JOIN
          </Button>

          {/* Cards Image on Mobile */}
          <Image src="/images/cards.png" alt="Cards" width="150px" />
        </VStack>
      )}
    </Box>
  );
};

export default LandingPage;
