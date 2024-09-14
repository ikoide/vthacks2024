import React from "react";
import { Toolbar, Typography, Button, Box } from "@mui/material";
import "../styles/styles.scss"

const Header: React.FC = () => {
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
            onClick={() => {}}
          >
            Logout
          </Button>
        </Toolbar>
      </header>
  );
};

export default Header;
