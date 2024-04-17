// import './App.css'
import Home from "./components/Home"
import HomeOutput from "./components/HomeOutput"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/HomeOutput" element={<HomeOutput/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;