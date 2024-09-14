import React, { useState, Dispatch, SetStateAction } from "react";
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
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  // Include other user data properties as necessary
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface CourseChoicePageProps {
  userData: UserData; 
  setUserData: Dispatch<SetStateAction<UserData>>;
}

const CourseChoicePage: React.FC<CourseChoicePageProps> = ({ userData, setUserData }) => {
  const [addInput, setAddInput] = useState<string>("");
  const [dropInput, setDropInput] = useState<string>("");
  const navigate = useNavigate();

  const updateUserData = (updatedUserData: UserData) => {
    console.log("Updating user data:", updatedUserData);
    fetch(`${API_URL}/users/${updatedUserData.sess_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend returned:", data);
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const handleAddCourse = (): void => {
    if (addInput.trim() !== "") {
      const updatedCoursesToAdd = [...userData.courses_to_add, addInput.trim()];
      const updatedUserData = { ...userData, courses_to_add: updatedCoursesToAdd };
      setUserData(updatedUserData);
      setAddInput("");

      // Update user data in the backend
      updateUserData(updatedUserData);
    }
  };

  const handleDropCourse = (): void => {
    if (dropInput.trim() !== "") {
      const updatedCoursesToDrop = [...userData.courses_to_drop, dropInput.trim()];
      const updatedUserData = { ...userData, courses_to_drop: updatedCoursesToDrop };
      setUserData(updatedUserData);
      setDropInput("");

      // Update user data in the backend
      updateUserData(updatedUserData);
    }
  };

  const removeAddCourse = (index: number): void => {
    const filteredCoursesToAdd = userData.courses_to_add.filter((_, i) => i !== index);
    const updatedUserData = { ...userData, courses_to_add: filteredCoursesToAdd };
    setUserData(updatedUserData);

    // Update user data in the backend
    updateUserData(updatedUserData);
  };

  const removeDropCourse = (index: number): void => {
    const filteredCoursesToDrop = userData.courses_to_drop.filter((_, i) => i !== index);
    const updatedUserData = { ...userData, courses_to_drop: filteredCoursesToDrop };
    setUserData(updatedUserData);

    // Update user data in the backend
    updateUserData(updatedUserData);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="course-choice-page">
        {/* Add Course Section */}
        <Paper className="section" elevation={3}>
          <Typography variant="h6" gutterBottom>
            Which courses are you in need of?
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Enter course ID to add"
              variant="outlined"
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              className="input-field"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCourse}
              className="add-button"
              style={{ marginLeft: '10px' }}
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
          <Typography variant="h6" gutterBottom>
            What courses are willing to offer to other users?
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Enter course ID to drop"
              variant="outlined"
              value={dropInput}
              onChange={(e) => setDropInput(e.target.value)}
              className="input-field"
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDropCourse}
              className="drop-button"
              style={{ marginLeft: '10px' }}
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

        {/* Done Button */}
        <Paper className="section" elevation={3}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/thank-you")}
            fullWidth
            size="large"
          >
            Done
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default CourseChoicePage;
