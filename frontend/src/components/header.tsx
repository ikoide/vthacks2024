import React from "react";
import { Toolbar, Typography, Button, Box } from "@mui/material";
import "../styles/styles.scss";
import { useNavigate } from "react-router-dom";

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  email: string;
  name: string;
}

interface HeaderProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const Header: React.FC<HeaderProps> = ({ setUserData }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("session");
    setUserData({
      courses_to_add: [],
      courses_to_drop: [],
      sess_id: "",
      email: "",
      name: "",
    });
    navigate("/login-or-signup");
    setIsOpen(false);
  };

  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header>
      <Toolbar>
        <Box>
          <a
            className="logo"
            href="/"
            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "#ffffff", fontWeight: "bold", width: "" }}
            >
              HokieSWAP
            </Typography>
          </a>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          sx={{ color: "#ffffff", mx: 1 }}
          onClick={() => navigate("/add-drop")}
        >
          Add/Drop
        </Button>

        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: "#c93838",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#bd4f4f",
            },
          }}
          variant="contained"
        >
          Logout
        </Button>
      </Toolbar>
    </header>
  );
};

export default Header;
