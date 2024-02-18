/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Forgot from "./pages/Forgot";
import { useEffect, useState } from 'react';
import Leaderboard from './pages/Leaderboard';



function App() {
  
  const [data, setData] = useState(null)

  const getData = () => {
    fetch("http://127.0.0.1:8080/get-nyc-events")
    .then(response => { return response.json()
    })
    .then(data => {
      setData(data);
      console.log(data)
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }

  useEffect(() => {
    // Callback getData when the component mounts
    getData();
  }, []);


  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/leaderboard" element={<Leaderboard/>} /> 
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
