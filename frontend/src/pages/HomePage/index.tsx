import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "@mui/material/Button";
const API_URL = import.meta.env.VITE_API_URL;

const HomePage = ({ userData, setUserData }: any): JSX.Element => {
    const navigate = useNavigate();

    // Check if userData is not null/undefined and has keys (is not an empty object)
    const isLoggedIn = userData && Object.keys(userData).length > 0;


    useEffect(() => {
    }
    , []);

    return (
        <div>
            {isLoggedIn ? (
                <div className="landing-page">
                    <p>Welcome, {userData.name}!</p>
                    <p>Email: {userData.email}</p>
                    <Button
                        variant="contained"
                        className="logout-button"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                            localStorage.removeItem("session");
                            setUserData({});
                        }}
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <div className="login">
                    <p>HokieSWAP</p>
                    <Button
                        variant="contained"
                        className="login-button"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                            navigate("/login-or-signup");
                        }}
                    >
                        Login or Sign Up
                    </Button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
