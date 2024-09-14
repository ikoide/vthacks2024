import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  Box, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper, 
  Button, 
  TextField 
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import './assets/style.scss';

const WEBSOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL;

interface TradeData {
    [userId: string]: {
        drop: any;
        add: any;
        cookies: any;
        ready: boolean;
    };
}

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  email: string;
}

interface TradePageProps {
  userData: UserData; 
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TradePage: React.FC<TradePageProps> = ({ userData }) => {
    const { trade_id } = useParams<{ trade_id: string }>();
    const [tradeData, setTradeData] = useState<TradeData>({});
    const [cookies, setCookies] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [tradeConcluded, setTradeConcluded] = useState(false); // New state variable

    const currentUserId = userData.email;

    const navigate = useNavigate();

    useEffect(() => {
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            const session = localStorage.getItem("session");
            if (session && session !== "undefined" && session !== "null" && session !== "") {
            fetch(`${API_URL}/users/${session}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("The data is: ", data);
                if (data.email === null) {
                    localStorage.removeItem("session");
                    navigate("/login-or-signup");
                }

                const message = {
                    type: 'join_trade',
                    trade_id: trade_id,
                    user_id: data.email
                };
                socket.send(JSON.stringify(message));
            })
        } else navigate("/login-or-signup");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'trade_data') {
                setTradeData(data.trade);
            } else if (data.type === 'end_trade') {
                setTradeConcluded(true); // Set trade as concluded
            } else if (data.type === 'error') {
                console.error(data.message);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleReady = () => {
        if (socket) {
            const message = {
                type: 'trade_ready',
                trade_id: trade_id,
                user_id: currentUserId,
                cookies: cookies,
            };
            socket.send(JSON.stringify(message));
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box className="trade-page">
                {tradeConcluded ? (
                    // Trade Concluded Screen
                    <Box className="concluded-screen">
                        <Typography variant="h4" gutterBottom>
                            Trade Concluded
                        </Typography>
                        <Typography variant="body1">
                            Thank you for participating in the trade. Your items have been successfully exchanged.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/dashboard')}
                            className="dashboard-button"
                        >
                            Go to Dashboard
                        </Button>
                    </Box>
                ) : (
                    // Trade In Progress Screen
                    <>
                        <Typography variant="h5">Trade Status</Typography>
                        <TableContainer component={Paper} className="table-container">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User ID</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Items to Drop</TableCell>
                                        <TableCell>Items to Receive</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(tradeData).map(([userId, userData]) => (
                                        <TableRow key={userId} className={userId === currentUserId ? 'current-user-row' : ''}>
                                            <TableCell>{userId === currentUserId ? `${userId} (You)` : userId}</TableCell>
                                            <TableCell>{userData.ready ? 'Ready' : 'Not Ready'}</TableCell>
                                            <TableCell>{JSON.stringify(userData.drop)}</TableCell>
                                            <TableCell>{JSON.stringify(userData.add)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {tradeData[currentUserId] && (
                            <Box className="trade-details">
                                <Typography variant="h6">Your Trade Details</Typography>
                                <Typography>Items you are dropping: {JSON.stringify(tradeData[currentUserId].drop)}</Typography>
                                <Typography>Items you will receive: {JSON.stringify(tradeData[currentUserId].add)}</Typography>

                                <Box className="input-field">
                                    <TextField
                                        label="Cookies"
                                        variant="outlined"
                                        fullWidth
                                        value={cookies}
                                        onChange={(e) => setCookies(e.target.value)}
                                        placeholder="Enter your cookies"
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReady}
                                    disabled={tradeData[currentUserId].ready}
                                    className="ready-button"
                                >
                                    {tradeData[currentUserId].ready ? 'Ready' : 'Mark as Ready'}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default TradePage;
