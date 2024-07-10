import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AIBotInteraction from './components/mainPages/AIBotInteraction';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import SuccessRegistrationPage from './components/statusPages/successRegistrationPage';
import ForgotPassword from "./components/forgetLink/forgetLinkPage";
import PasswordResetPage from './components/forgetLink/emailRedirectedPage';
import './App.css';
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/AIBotInteraction' element={<PrivateRoute><AIBotInteraction /></PrivateRoute>} />
        <Route path='/statusPages/SuccessRegistrationPage' element={<SuccessRegistrationPage />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/PasswordResetPage' element={<PasswordResetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
