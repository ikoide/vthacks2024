import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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

interface TradePagePageProps {
  userData: UserData; 
}

const TradePage: React.FC<TradePagePageProps> = ({ userData }) => {
    const { trade_id } = useParams<{ trade_id: string }>();
    const [tradeData, setTradeData] = useState<TradeData>({});
    const [cookies, setCookies] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);

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
                // if data.email is null then clear local storage and go to login apge
                if (data.email === null) {
                    localStorage.removeItem("session");
                    navigate("/login-or-signup");
                }

                const message = {
                    "fuck": "fuck",
                    type: 'join_trade',
                    trade_id: trade_id,
                    user_id: data.email
                };
                socket.send(JSON.stringify(message));
                // navigate("/add-drop")
            })
        } else navigate("/login-or-signup");
            

        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'trade_data') {
                setTradeData(data.trade);
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
        <div>
          {JSON.stringify(tradeData)}
            <h2>Trade Status</h2>
            <table border={1}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Status</th>
                        <th>Items to Drop</th>
                        <th>Items to Receive</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(tradeData).map(([userId, userData]) => (
                        <tr key={userId} style={{ backgroundColor: userId === currentUserId ? '#e0ffe0' : 'transparent' }}>
                            <td>{userId === currentUserId ? `${userId} (You)` : userId}</td>
                            <td>{userData.ready ? 'Ready' : 'Not Ready'}</td>
                            <td>{JSON.stringify(userData.drop)}</td>
                            <td>{JSON.stringify(userData.add)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {tradeData[currentUserId] && (
                <div>
                    <h3>Your Trade Details</h3>
                    <p>Items you are dropping: {JSON.stringify(tradeData[currentUserId].drop)}</p>
                    <p>Items you will receive: {JSON.stringify(tradeData[currentUserId].add)}</p>

                    <div>
                        <label>Cookies: </label>
                        <input
                            type="text"
                            value={cookies}
                            onChange={(e) => setCookies(e.target.value)}
                            placeholder="Enter your cookies"
                        />
                    </div>
                    <button onClick={handleReady} disabled={tradeData[currentUserId].ready}>
                        {tradeData[currentUserId].ready ? 'Ready' : 'Mark as Ready'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TradePage;
