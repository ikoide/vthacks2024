import React, { useState, useEffect } from 'react';
import { Card, CardContent, createTheme, ThemeProvider, Typography, Box } from '@mui/material';
import { courses } from "../../public/courses"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Swaps: React.FC = () => {
  const [swaps, setSwaps] = useState<any[]>([]); // State to store fetched data

  const fetchSwaps = async () => {
    try {
      const response = await fetch('https://api.hokieswap.com/swaps', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Swaps data:', data);
      setSwaps(data); // Store fetched data in state
    } catch (error) {
      console.error('Error fetching swaps:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSwaps();
  }, []);
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column', // Stacking cards vertically
        alignItems: 'center', // Centering the cards horizontally
        }}>
        
        <Typography sx={{color: "white", fontWeight: 600, pb: 3}} variant='h3'>Hello, Imran 🫣</Typography>

        {swaps.length > 0 ? (
          swaps.map((swap, index) => {
            const crn1: string = swap.items[0]
            const courseId1 = `${courses[crn1]["Course"].split("-").join(" ")}`
            const crn2: string = swap.items[1]
            const courseId2 = `${courses[crn2]["Course"].split("-").join(" ")}`
            const status = swap.status
            return(
            <Box
              key={index}
              sx={{
                width: 600,
                padding: "0.5rem"
              }}
            >
              <Card variant="elevation">
                <CardContent>
                  <Typography variant="body2" color='text.secondary'>
                    SWAP: {swap._id["$oid"]} {/* Assuming `id` is part of the object */}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{mb: -1}}>
                    {courseId1} {`→`} {courseId2} {/* Assuming these are fields */}
                  </Typography>
                  <Typography>{status}</Typography>
                </CardContent>
              </Card>
            </Box>
          )})
        ) : (
          <Typography variant="h6" color="text.secondary">
            No swaps available
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}
