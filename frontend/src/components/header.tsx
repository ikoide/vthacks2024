import React from "react";
import { Toolbar, Typography, Button, Box } from "@mui/material";
import "../styles/styles.scss"
import { useNavigate } from "react-router-dom";

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  // Include other user data properties as necessary
}

interface HeaderProps {

  setUserData: React.Dispatch<React.SetStateAction<UserData>>;

}

const Header: React.FC<HeaderProps> = ({ setUserData }) => {
  const navigate = useNavigate();

  return (
      <header>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ color: "#ffffff" }}>
              HokieSWAP
            </Typography>
          </Box>
          <Button
            color="inherit"
            sx={{ color: "#ffffff" }}
            onClick={() => {
              localStorage.removeItem("session");
              setUserData({});
              navigate("/login-or-signup");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </header>
  );
};

export default Header;
