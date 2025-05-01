import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatbotContainer } from './features/chatbot';

function App() {
  return (
    <div className="max-h-screen flex flex-col">
      {/* Otro contenido de tu aplicación */}
      <ChatbotContainer />
    </div>
  );
}

export default App;
