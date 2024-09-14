import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import LoginPageAndSignUp from './pages/LoginAndSignupPage';
import NotFound404 from './components/HTTPErrors/NotFound404';
import CourseChoicePage from './pages/CourseChoicePage';
const API_URL = import.meta.env.VITE_API_URL;
import "./styles/styles.scss"
interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  // Include other user data properties as necessary
}

function App() {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData>({ courses_to_add: [], courses_to_drop: [] });

  const navigate = useNavigate();

  useEffect(() => {

        // grab session from local storage
        const session = localStorage.getItem("session");
        if (session && session !== "undefined" && session !== "null" && session !== "") {
            // fetch /users/session
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

                    setUserData(data);
                    navigate("/add-drop")
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // remove session from local storage
                    localStorage.removeItem("session");
                });
        } else {
            navigate("/login-or-signup");
        }
  }, []);

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage userData={userData} setUserData={setUserData}/>} />
      <Route path="/login-or-signup" element={<LoginPageAndSignUp setUserData={setUserData} />} />
      <Route path="*" element={<NotFound404 />} />
      <Route path="/add-drop" element={<CourseChoicePage userData={userData} setUserData={setUserData} />} />
    </Routes>
  )
}

export default App;