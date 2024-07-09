import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AIBotInteraction from './components/mainPages/AIBotInteraction';
import LandingPage from './pages/LandingPage';
import ProfileManagement from './components/mainPages/ProfileManagement';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <ProtectedRoute path='/ProfileManagement' element={<ProfileManagement />} />
        <ProtectedRoute path='/AIBotInteraction' element={<AIBotInteraction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
