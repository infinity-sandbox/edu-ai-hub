import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AIClass from './components/mainPages/AIClass';
import PaymentPlan from './components/mainPages/PricingPlans';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/mainPages/Home';
import './App.css';
import SuccessRegistrationPage from '../src/components/statusPages/successRegistrationPage'
import ForgotPassword from '../src/components/forgetLink/forgetLinkPage'
import PasswordResetPage from '../src/components/forgetLink/emailRedirectedPage'
import ProfileManagement from '../src/components/ProfileManagements/ProfileManagement'
import ChatRoom from './components/mainPages/ChatRoom';
import 'simplebar/dist/simplebar.min.css';
import MainLayout from './components/Layout';



function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/status-pages/success-registration-page' element={<SuccessRegistrationPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/password-reset-page' element={<PasswordResetPage />} />
          {/* secured pages */}
          <Route path='/home' element={<PrivateRoute element={<Home />} />} />
          <Route path='/aibot-class' element={<PrivateRoute element={<AIClass />} />} />
          <Route path='/chatRoom' element={<PrivateRoute element={<ChatRoom />} />} />
          <Route path='/profile-management' element={<PrivateRoute element={<ProfileManagement />} />} />
          <Route path='/paymentplan' element={<PrivateRoute element={<PaymentPlan />} />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
