import { Box, Button, Text, Image, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ChoosePlayerPage = () => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)"); // Detect desktop & when to switch 

    return (
    <Box
        width="100vw"
        height="100vh"
        bg="#E9C46A"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        overflow="hidden"
        p={[2, 4]}
    >
      {/* Responsive Square Background Box */}
    <Box
        width={isDesktop ? "600px" : "90%"} // 600px on desktop, 90% on mobile
        height={isDesktop ? "600px" : "700px"} // Large square on desktop, taller on mobile
        aspectRatio={isDesktop ? 1 : undefined} // Square on desktop, flexible on mobile
        bg="#F4A261"
        border="2px solid #2A9D8F"
        borderRadius="md"
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
            fontSize={["xl", "2xl", "28px"]}
            fontWeight="bold"
            textAlign="center"
            bg="#f4f1de"
            p={4}
            borderRadius="md"
            color="#264653"
            width="80%"
            mt={["10px", "20px"]}
        >
            Choose a Player
        </Text>

        {/* Clickable Image Link */}
        <Link to="/choosestatement">
            <Image
                src="/images/rat_silhouette.png"
                width={["60%", "80%"]}
                mt={["20px", "40px"]}
                cursor="pointer"
                _hover={{
                transform: "scale(1.1)",
                transition: "0.3s ease-in-out",
            }}
        />
        </Link>
    </Box>

      {/* Overlapping Cards */}
    <Box
        position="absolute"
        bottom={["-20px", "-50px", "-130px"]}
        right={isDesktop ? "350px" : "10px"}
    >
    </Box>
    </Box>
);
};

export default ChoosePlayerPage;
