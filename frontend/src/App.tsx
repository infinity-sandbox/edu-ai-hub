import React from 'react';
import Login  from './pages/Login';
import Register from './pages/Register';
import AIBotInteraction from './components/mainPages/AIBotInteraction';
import LandingPage from './pages/LandingPage';
import './App.css';
import { Routes,Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/Login' element={<Login/>}> </Route>
        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/AIBotInteraction' element={<AIBotInteraction/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
