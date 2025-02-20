import { Box, Image, Text, Grid } from "@chakra-ui/react";

const GameBoard = () => {
    return (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg="#2A9D8F"
        p={2}
    >
    {/* Outer Game Border (Red Game Mat) */}
    <Box
        width={["95vw", "90vw", "80vw"]} // Scale width with screen
        height={["90vh", "85vh", "80vh"]} // Scale height with screen
        maxWidth="1000px"
        maxHeight="700px"
        bg="#E9C46A"
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
    >
        {/* Main Game Area */}
        <Box
            width="90%" // Keep proportions stable
            height="90%"
            bg="#F4A261"
            borderRadius="md"
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
          {/* Centered Title Inside Box */}
        <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize={["30px", "40px", "50px"]}
            fontWeight="bold"
            color="#264653"
            textAlign="center"
            opacity={0.2}
        >
            Cockroach Poker
        </Text>

        {/* Responsive Player Cards */}
        {[
            { left: "10%", top: "10%", highlight: 1 },
            { left: "10%", bottom: "10%", highlight: 6 },
            { right: "10%", top: "10%", highlight: 5 },
            { right: "10%", bottom: "10%", highlight: 4 },
        ].map((pos, index) => (
            <Grid
                key={index}
                templateColumns="repeat(2, 1fr)"
                templateRows="repeat(4, 1fr)"
                gap={1}
                width="50px"
                height="120px"
                position="absolute"
                {...pos}
            >
            {[...Array(8)].map((_, i) => (
                <Box
                    key={i}
                    width="100%"
                    height="100%"
                    bg={i === pos.highlight ? "#5b7553" : "gray.200"}
                    borderRadius="md"
                />
            ))}
            </Grid>
        ))}

        {/* Game Board Images */}
        {[
            { src: "images/bat_silhouette.png", left: "5%", bottom: "5%" },
            { src: "images/toad_silhouette.png", right: "5%", top: "5%" },
            { src: "images/cockroach_silhouette.png", left: "5%", top: "5%" },
            {
                src: "images/rat_silhouette.png",
                right: "5%",
                bottom: "5%",
                transform: "scaleX(-1)",
            },
        ].map((img, i) => (
            <Image
                key={i}
                position="absolute"
                src={img.src}
                width={["50px", "65px", "80px"]}
                {...img}
            />
        ))}
        </Box>
    </Box>
    </Box>
);
};

export default GameBoard;
