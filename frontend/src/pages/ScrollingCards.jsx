import { Box, Grid } from "@chakra-ui/react"

const ScrollingCards = () => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="#eaeaea"
    >
      {/* Scrollable Container */}
      <Box
        width="400px"
        height="600px"
        overflowY="scroll"
        borderRadius="md"
        boxShadow="lg"
        p={4}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
          '-ms-overflow-style': 'none', 
          'scrollbar-width': 'none',
        }}
      >
        {/* Grid of Rectangles */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {/* Generate 20 Rectangles */}
          {Array.from({ length: 20 }).map((_, index) => (
            <Box
              key={index}
              width="150px"
              height="100px"
              bg={index % 2 === 0 ? "blue.300" : "red.300"} // alternate colors
              borderRadius="md"
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontSize="lg"
              fontWeight="bold"
              color="white"
            >
              {index + 1}
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ScrollingCards;
