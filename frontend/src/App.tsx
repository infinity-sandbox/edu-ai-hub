import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AIBotInteraction from './components/mainPages/AIBotInteraction';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import ViewProfile from './pages/ViewProfile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/ViewProfile' element={<ViewProfile />}/>

        <Route path='/AIBotInteraction' element={<PrivateRoute><AIBotInteraction /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
