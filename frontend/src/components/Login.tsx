import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import sideSvgImage from '../images/image1.svg'
import logo from "../images/logo.svg";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFinish = () => {
    const loginData = { email, password };
    console.log('Login data: ', loginData);
    axios.post('http://localhost:3000/login', loginData)
      .then(result => console.log(result))
      .catch(err => console.log(err));

    // Create JSON object
    const json = JSON.stringify(loginData, null, 2);

    // Create a blob from the JSON object and save it as a file
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'loginData.json');
  };

  return (
    <div className='LoginPage'>
      
    <div className="login-container">
      <div>
       <div className="logo">
          <img src={logo} />
        </div>
     <div>
      <Form
        name="login"
        onFinish={onFinish}
        className="login-form"
      >
        <h1 className='loginLeable'>Login</h1>
        <div className='EmailText'>Email</div>
        <Form.Item className='emailInput'
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            className='emailInput'
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Item>
        <div className='PasswordText'>
          <div>Password</div>
          <div className="forgot-link">
            <a href="#">Forgot?</a>
          </div>
        </div>
        <Form.Item className='passwordInput'
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
            className='passwordInput'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
        
        <Form.Item>
          <Button htmlType="submit" className="login-button">
            Login now
          </Button>
        </Form.Item>
        <div className="signup-link">
          Don't have an account?<Link to="/Register">Sign up</Link>
        </div>
      </Form>
      </div>
      </div>
    </div>
    <div className="Right-side">
     
      <img src= {sideSvgImage} alt="Left Side Design" />
    
    </div>
    
    </div>
  );
};

export default Login;
