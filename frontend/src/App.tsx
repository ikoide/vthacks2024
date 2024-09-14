import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import LoginPageAndSignUp from './pages/LoginAndSignupPage';
import NotFound404 from './components/HTTPErrors/NotFound404';
import { CourseChoicePage } from './pages/CourseChoicePage';


function App() {
  const location = useLocation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData({});
  }, []);

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage userData={userData} />} />
      <Route path="/login-or-signup" element={<LoginPageAndSignUp setUserData={setUserData} />} />
      <Route path="*" element={<NotFound404 />} />
      <Route path="/add-drop" element={<CourseChoicePage />} />
    </Routes>
  )
}

export default App;