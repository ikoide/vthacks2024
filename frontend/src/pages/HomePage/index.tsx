import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

const HomePage = ({ userData }: any): JSX.Element => {
    const navigate = useNavigate();

    // Check if userData is not null/undefined and has keys (is not an empty object)
    const isLoggedIn = userData && Object.keys(userData).length > 0;

    return (
        <div>
            {isLoggedIn ? (
                <div className="landing-page">
                    <p>Welcome, {userData.name}!</p>
                    <Button
                        variant="contained"
                        className="logout-button"
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                            // navigate to a logout or user profile page
                            navigate("/profile");
                        }}
                    >
                        Go to Profile
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
