import { Box, Button, Text, Image, VStack, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ChooseStatementPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)"); // Detect desktop

  return (
    <Box
      width="100vw"
      height="100vh"
      bg="#E9C46A" // Background color
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      overflow="hidden"
      p={[2, 4]}
    >
      {/* Responsive Square Box */}
      <Box
        width={isDesktop ? "600px" : "90%"} // 600px on desktop, 90% on mobile
        height={isDesktop ? "600px" : "700px"} // Maintain large square on desktop, tall on mobile
        aspectRatio={isDesktop ? 1 : undefined} // Ensure it's square on larger screens
        bg="#F4A261"
        border="2px solid #2A9D8F"
        borderRadius="md"
        boxShadow="lg"
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={6}
        overflow="hidden"
      >
        {/* Tree Silhouette */}
        <Box
          position="absolute"
          top="1"
          left={["-100px", "-200px"]}
          width={["400px", "750px"]}
          height="auto"
          zIndex="-2"
        >
        </Box>

        {/* Title */}
        <Text
          position="absolute"
          top={["10px", "20px"]}
          fontSize={["xl", "2xl", "28px"]}
          fontWeight="bold"
          textAlign="center"
          bg="#f4f1de"
          p={4}
          borderRadius="md"
          boxShadow="md"
          color="#264653"
          width="80%"
        >
          Choose a Statement
        </Text>

        {/* "This is a..." Text */}
        <Text
          position="absolute"
          top={["90px", "120px"]}
          left="50%"
          transform="translateX(-50%)"
          fontSize={["sm", "md"]}
          fontWeight="bold"
          textAlign="center"
          bg="#f4f1de"
          p={2}
          borderRadius="md"
          color="#264653"
          width="50%"
        >
          This is a...
        </Text>

        {/* Scrollable Cards Section */}
        <Box
          width={["90%", "250px"]}
          height={["300px", "400px"]}
          overflowY="scroll"
          p={3}
          position="relative"
          top={["150px", "200px"]}
        >
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
              _hover={{ bg: "#2A9D8F" }}
              onClick={() => alert(`You selected Card ${index + 1}`)}
            >
              Card {index + 1}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Overlapping Cards Image */}
      <Box
        position="absolute"
        bottom={["-20px", "-50px", "-130px"]}
        right={isDesktop ? "350px" : "10px"}
      >

      </Box>
    </Box>
  );
};

export default ChooseStatementPage;
