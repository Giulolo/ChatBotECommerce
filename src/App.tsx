import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatbotContainer } from './features/chatbot';
import { PageHeader } from './components/layouts/PageHeader';

function App() {
  return (
    <div className="max-h-screen flex flex-col">
      {/* Otro contenido de tu aplicación */}
      <PageHeader/>
      <ChatbotContainer />
    </div>
  );
}

export default App;
