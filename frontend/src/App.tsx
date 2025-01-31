// src/App.tsx
import React from 'react';
import Sidebar from './components/Sidebar';
import CanvasBoard from './components/Canvasboard.tsx';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <CanvasBoard />
    </div>
  );
};

export default App;