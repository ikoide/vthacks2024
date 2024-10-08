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
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./assets/style.scss";
import { useNavigate } from "react-router-dom";
import rawData from "./assets/data.json"; // Import the course data
import { createFilterOptions } from "@mui/material/Autocomplete";

const API_URL = import.meta.env.VITE_API_URL;

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  email: string;
  name: string;
}


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface CourseOption {
  crn: string;
  name: string;
}

interface CourseChoicePageProps {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
}

// **Explicitly define the type of data as Record<string, string>**
const data: Record<string, string> = rawData;

const CourseChoicePage: React.FC<CourseChoicePageProps> = ({ userData, setUserData }) => {
  const [addInput, setAddInput] = useState<CourseOption | null>(null);
  const [addInputValue, setAddInputValue] = useState<string>("");
  const [dropInput, setDropInput] = useState<CourseOption | null>(null);
  const [dropInputValue, setDropInputValue] = useState<string>("");
  const navigate = useNavigate();

  // Transform the course data into an array of options
  const courses: CourseOption[] = Object.entries(data).map(([crn, name]) => ({ crn, name }));

  // Custom filter options for fuzzy matching
  const filterOptions = createFilterOptions({
    limit: 5,
    stringify: (option: CourseOption) => `${option.crn} ${option.name}`,
  });

  const updateUserData = (updatedUserData: UserData) => {
    fetch(`${API_URL}/users/${updatedUserData.sess_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
  };

  const handleAddCourse = (): void => {
    if (addInput) {
      if (!userData.courses_to_add.includes(addInput.crn)) {
        const updatedCoursesToAdd = [...userData.courses_to_add, addInput.crn];
        const updatedUserData = { ...userData, courses_to_add: updatedCoursesToAdd };
        setUserData(updatedUserData);
        setAddInput(null);
        setAddInputValue("");

        // Update user data in the backend
        updateUserData(updatedUserData);
      } else {
        // Optionally, notify the user that the course is already added
        console.warn("Course already added.");
      }
    }
  };

  const handleDropCourse = (): void => {
    if (dropInput) {
      if (!userData.courses_to_drop.includes(dropInput.crn)) {
        const updatedCoursesToDrop = [...userData.courses_to_drop, dropInput.crn];
        const updatedUserData = { ...userData, courses_to_drop: updatedCoursesToDrop };
        setUserData(updatedUserData);
        setDropInput(null);
        setDropInputValue("");

        // Update user data in the backend
        updateUserData(updatedUserData);
      } else {
        // Optionally, notify the user that the course is already dropped
        console.warn("Course already dropped.");
      }
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
          <Typography variant="subtitle1" gutterBottom>
            Which courses are you in need of?
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => `${option.crn} - ${option.name}`}
              filterOptions={filterOptions}
              value={addInput}
              onChange={(_, newValue) => {
                setAddInput(newValue);
              }}
              inputValue={addInputValue}
              onInputChange={(_, newInputValue) => {
                setAddInputValue(newInputValue);
              }}
              open={addInputValue.trim().length > 0}
              renderInput={(params) => (
                <TextField {...params} label="Enter course to add" variant="outlined" fullWidth />
              )}
              style={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCourse}
              className="add-button"
              style={{ marginLeft: "10px" }}
              disabled={!addInput} // Disable button if no valid course is selected
            >
              Add Course
            </Button>
          </Box>
          <Box>
            {userData.courses_to_add.map((crn, index) => (
              <Paper key={index} className="course-item" elevation={2}>
                <Typography variant="body1">{`${crn} - ${data[crn]}`}</Typography>
                <IconButton onClick={() => removeAddCourse(index)}>
                  <CloseIcon />
                </IconButton>
              </Paper>
            ))}
          </Box>

          {/* Drop Course Section */}
          <Typography sx={{ mt: 4.5 }} variant="subtitle1" gutterBottom>
            What courses are you willing to offer to other users?
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => `${option.crn} - ${option.name}`}
              filterOptions={filterOptions}
              value={dropInput}
              onChange={(_, newValue) => {
                setDropInput(newValue);
              }}
              inputValue={dropInputValue}
              onInputChange={(_, newInputValue) => {
                setDropInputValue(newInputValue);
              }}
              open={dropInputValue.trim().length > 0}
              renderInput={(params) => (
                <TextField {...params} label="Enter course to drop" variant="outlined" fullWidth />
              )}
              style={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDropCourse}
              className="drop-button"
              style={{ marginLeft: "10px" }}
              disabled={!dropInput} // Disable button if no valid course is selected
            >
              Drop Course
            </Button>
          </Box>
          <Box>
            {userData.courses_to_drop.map((crn, index) => (
              <Paper key={index} className="course-item" elevation={2}>
                <Typography variant="body1">{`${crn} - ${data[crn]}`}</Typography>
                <IconButton onClick={() => removeDropCourse(index)}>
                  <CloseIcon />
                </IconButton>
              </Paper>
            ))}
            <Button
              variant="contained"
              color="primary"
              sx={
                {
                  color: "#ffffff",
                  "background-color": "#1976d2!important"
                }
              }
              onClick={() => {
                // Post to backend /users/session_id/scan
                if (userData.courses_to_drop.length > 0 && userData.courses_to_add.length > 0) {
                  fetch(`${API_URL}/users/${userData.sess_id}/scan`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => res.json())

                  navigate("/thank-you");
                }
              }}
              fullWidth
              size="large"
            >
              Find Matches
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default CourseChoicePage;
