import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import LoginPageAndSignUp from './pages/LoginAndSignupPage';
import NotFound404 from './components/HTTPErrors/NotFound404';
import CourseChoicePage from './pages/CourseChoicePage';
import ThankYouPage from './pages/ThankYouPage';


import Header from "./components/header";
const API_URL = import.meta.env.VITE_API_URL;
import "./styles/styles.scss"

import TradePage from './pages/TradePage';
import { ClassesPage } from './pages/ClassesPage/ClassesPage';

interface UserData {
  courses_to_add: string[];
  courses_to_drop: string[];
  sess_id: string;
  email: string;
  // Include other user data properties as necessary
}

function App() {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData>({ courses_to_add: [], courses_to_drop: [] , sess_id: "", email: ""});

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
                    // navigate("/add-drop")
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
    <>
    {!location.pathname.includes('login') && <Header setUserData={setUserData} />}
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage userData={userData} setUserData={setUserData}/>} />
      <Route path="/login-or-signup" element={<LoginPageAndSignUp setUserData={setUserData} />} />
      <Route path="*" element={<NotFound404 />} />
      <Route path="/add-drop" element={<CourseChoicePage userData={userData} setUserData={setUserData} />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/trade/:trade_id" element={<TradePage userData={userData}  />} />
      <Route path="/classes" element={<ClassesPage />} />
    </Routes>
    </>
  )
}

export default App;