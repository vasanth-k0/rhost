import React from 'react';
import './App.css'
import Console from './components/Console';

function App() {
  return (
    <div style={{ position: 'absolute', height: '100vh', width: '100vw' , top: 0, left: 0, margin:0, padding: 0}}>
      <Console />
    </div>
  )
}

export default App
