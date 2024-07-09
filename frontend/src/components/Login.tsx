import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import sideSvgImage from '../images/image1.svg';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = async () => {
    setLoading(true);
    const loginData = { email, password };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, loginData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log('Login successful! Token:', token);
      message.success('Login successful!');
      history.push('/dashboard'); // Redirect after successful login
    } catch (err) {
      console.error('Login error:', err.response);
      if (err.response && err.response.status === 401) {
        message.error('Invalid email or password. Please try again.');
      } else {
        message.error('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decodedToken = jwt_decode<{ exp: number }>(token);
    return decodedToken.exp > Date.now() / 1000;
  };

  return (
    <div className='LoginPage'>
      <div className="login-container">
        <div>
          <Form
            name="login"
            onFinish={onFinish}
            className="login-form"
          >
            <h1 className='loginLeable'>Login</h1>
            <div className='EmailText'>Email</div>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
            >
              <Input
                prefix={<UserOutlined />}
                className='emailInput'
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email"
              />
            </Form.Item>
            <div className='PasswordText'>
              <div>Password</div>
              <div className="forgot-link">
                <Link to="/forgot-password">Forgot?</Link>
              </div>
            </div>
            <Form.Item
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
                aria-label="Password"
              />
            </Form.Item>
            
            <Form.Item>
              <Button htmlType="submit" className="login-button" loading={loading}>
                Login now
              </Button>
            </Form.Item>
            <div className="signup-link">
              <span>Don't have an account?</span>{" "}
              <Link to="/Register">Register</Link>
            </div>
          </Form>
        </div>
      </div>
      <div className="Right-side">
        <img src={sideSvgImage} alt="Right Side Design" />
      </div>
    </div>
  );
};

export default Login;
