import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginPageAndSignUp from './pages/LoginAndSignupPage/index.tsx';
import NotFound404 from './components/HTTPErrors/NotFound404/index.tsx';
import CourseChoicePage from './pages/CourseChoicePage/index.tsx';
import ThankYouPage from './pages/ThankYouPage/index.tsx';


import Header from "./components/header.tsx";
const API_URL = import.meta.env.VITE_API_URL;
import "./styles/styles.scss"

import TradePage from './pages/TradePage/index.tsx';
import { ClassesPage } from './pages/ClassesPage/ClassesPage.tsx';
import { Swaps } from './pages/Swaps.jsx';


function App() {
  const location = useLocation();
  const [userData, setUserData] = useState({ courses_to_add: [], courses_to_drop: [], sess_id: "", email: "", name: "" });

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
          if (data.email === null) {
            localStorage.removeItem("session");
            navigate("/login-or-signup");
          }

          setUserData(data);
          // navigate("/add-drop")
        })
        .catch((error) => {
          // remove session from local storage
          localStorage.removeItem("session");
        });
    } else {
      navigate("/login-or-signup");
    }
  }, []);

  return (
    <>
      {!location.pathname.includes('login') && <Header userData={userData} setUserData={setUserData} />}
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Swaps userData={userData} setUserData={setUserData} />} />
        <Route path="/login-or-signup" element={<LoginPageAndSignUp setUserData={setUserData} />} />
        <Route path="*" element={<NotFound404 />} />
        <Route path="/add-drop" element={<CourseChoicePage userData={userData} setUserData={setUserData} />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/trade/:trade_id" element={<TradePage userData={userData} />} />
        <Route path="/classes" element={<ClassesPage />} />
      </Routes>
    </>
  )
}

export default App;
