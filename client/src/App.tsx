import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Upload } from './components/Upload';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  return (
  //  <Upload></Upload>
  <VideoPlayer src='http://localhost:8000/static/xd.mp4'></VideoPlayer>
  );
}

export default App;
