import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import "./assets/style.scss";

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  // Include other user data properties as necessary
}


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

import { Dispatch, SetStateAction } from 'react';
import Header from "../../components/header";

interface CourseChoicePageProps {
  userData: UserData; 
  setUserData: Dispatch<SetStateAction<any>>; // Specify the exact type of your state
}

const CourseChoicePage: React.FC<CourseChoicePageProps> = ({ userData, setUserData }) => {
  const [addInput, setAddInput] = useState<string>("");
  const [dropInput, setDropInput] = useState<string>("");

  const handleAddCourse = (): void => {
    if (addInput.trim() !== "") {
      const updatedCoursesToAdd = [...userData.courses_to_add, addInput.trim()];
      setUserData({...userData, courses_to_add: updatedCoursesToAdd});
      setAddInput("");
    }
  };

  const handleDropCourse = (): void => {
    if (dropInput.trim() !== "") {
      const updatedCoursesToDrop = [...userData.courses_to_drop, dropInput.trim()];
      setUserData({...userData, courses_to_drop: updatedCoursesToDrop});
      setDropInput("");
    }
  };

  const removeAddCourse = (index: number): void => {
    const filteredCoursesToAdd = userData.courses_to_add.filter((_, i) => i !== index);
    setUserData({...userData, courses_to_add: filteredCoursesToAdd});
  };

  const removeDropCourse = (index: number): void => {
    const filteredCoursesToDrop = userData.courses_to_drop.filter((_, i) => i !== index);
    setUserData({...userData, courses_to_drop: filteredCoursesToDrop});
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Header />
      <Box className="course-choice-page">
        {/* Add Course Section */}
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Add Courses
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Enter course ID to add"
              variant="outlined"
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              className="input-field"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCourse}
              className="add-button"
            >
              Add Course
            </Button>
          </Box>
          <Box>
            {userData.courses_to_add.map((course, index) => (
              <Paper key={index} className="course-item" elevation={2}>
                <Typography variant="body1">{course}</Typography>
                <IconButton onClick={() => removeAddCourse(index)}>
                  <CloseIcon />
                </IconButton>
              </Paper>
            ))}
          </Box>
        </Paper>

        {/* Drop Course Section */}
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Drop Courses
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Enter course ID to drop"
              variant="outlined"
              value={dropInput}
              onChange={(e) => setDropInput(e.target.value)}
              className="input-field"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDropCourse}
              className="drop-button"
            >
              Drop Course
            </Button>
          </Box>
          <Box>
            {userData.courses_to_drop.map((course, index) => (
              <Paper key={index} className="course-item" elevation={2}>
                <Typography variant="body1">{course}</Typography>
                <IconButton onClick={() => removeDropCourse(index)}>
                  <CloseIcon />
                </IconButton>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default CourseChoicePage;
