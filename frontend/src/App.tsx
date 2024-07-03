import React from 'react';
import Login  from './pages/Login';
import Register from './pages/Register'
import AIBotInteraction from '../src/components/mainPages/AIBotInteraction'
import './App.css';
import { Routes,Route, BrowserRouter} from 'react-router-dom'
// import 'antd/dist/antd.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/Login' element={<Login/>}> </Route>
        <Route path='/AIBotInteraction' element={<AIBotInteraction/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
