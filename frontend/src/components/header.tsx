import React from "react";
import { Toolbar, Typography, Button, Box } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
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

const Header: React.FC<HeaderProps> = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

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
        <Box sx={{ flexGrow: 1 }}>
          <a
            className="logo"
            href="/"
            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "#ffffff", fontWeight: "bold" }}
            >
              HokieSWAP
            </Typography>
          </a>
        </Box>
        <Button
          variant="contained"
          sx={{ color: "#ffffff", mx: 1 }}
          onClick={() => navigate("/add-drop")}
        >
          Add/Drop
        </Button>
        <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
          <Button
            variant="outlined"
            sx={{ color: "#ffffff", mx: 1, minWidth: "120px" }}
            onClick={handleMenuToggle}
            endIcon={<ArrowDropDown />}
          >
            {userData.name}
          </Button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 1,
                  backgroundColor: "#c93838",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={handleLogout}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    padding: "8px 16px",
                    backgroundColor: "#c93838",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#bd4f4f",
                    },
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Toolbar>
    </header>
  );
};

export default Header;
