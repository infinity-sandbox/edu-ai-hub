import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AIBotInteraction from './components/mainPages/AIBotInteraction';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './pages/AppLayout';
import Layout from './components/Layout';
import './App.css';
import SuccessRegistrationPage from '../src/components/statusPages/successRegistrationPage'
import ForgotPassword from '../src/components/forgetLink/forgetLinkPage'
import PasswordResetPage from '../src/components/forgetLink/emailRedirectedPage'


function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/AppLayout' element={<PrivateRoute><AppLayout/></PrivateRoute>}/>
        <Route path='/AIBotInteraction' element={<PrivateRoute><AIBotInteraction /></PrivateRoute>} />
         <Route path='/statusPages/SuccessRegistrationPage' element={<SuccessRegistrationPage />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/PasswordResetPage' element={<PasswordResetPage />} /> 
      </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
