import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 

  useEffect(() => {
    fetch(`${API_URL}/api/auth/dashboard`, {
      credentials: 'include'
    })
      .then(res => {
        setIsLoggedIn(res.ok); 
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (

    <div className="App">
      <Navbar isLoggedIn = {isLoggedIn} setIsLoggedin={setIsLoggedIn}/>
      <Routes>
        <Route path='/' element={<Login setIsLoggedin={setIsLoggedIn}/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login setIsLoggedin={setIsLoggedIn}/>}/>
        <Route path='/signup' element={<Signup setIsLoggedin={setIsLoggedIn}/>}/>
        <Route path='/dashboard' element={
        <PrivateRoute isLoggedIn={isLoggedIn}>
          <Dashboard/>
        </PrivateRoute>
        }/>
      </Routes>
    </div>
  );
}

export default App;
