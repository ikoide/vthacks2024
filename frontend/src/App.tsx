import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import NotFound404 from './components/HTTPErrors/NotFound404';



function App() {
  const location = useLocation();
  const [userData, setUserData] = useState({});

  return (
    <>
    <Routes key={location.pathname} location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
    </>
  )
}

export default App
