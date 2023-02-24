import React from 'react';
import { Upload } from './components/Upload';
import { VideoPlayer } from './components/VideoPlayer';
import { Navbar } from './components/Nav';
import { Routes, Route, BrowserRouter, NavLink } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Videos } from './components/Videos';

function App() {
  return (
    <BrowserRouter>
    <Navbar></Navbar>
      <Routes>
          <Route path="" element={<h1>Log in to view the content</h1>} />
          <Route path="login" element={<Login></Login>} />
          <Route path="register" element={<Register></Register>} />
          <Route path="videos" element={<Videos></Videos>} />
      </Routes>
      
  </BrowserRouter>
  //  <Upload></Upload>
  // <VideoPlayer src='http://localhost:8000/static/xd.mp4'></VideoPlayer>
  );
}

export default App;
