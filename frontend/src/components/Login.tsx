import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sideSvgImage from '../images/image1.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async () => {
    const loginData = { email, password };
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://0.0.0.0:8000/api/v1/auth/login', loginData);
      const { token } = response.data;

      // Save JWT to local storage
      localStorage.setItem('token', token);

      // Redirect to another page after successful login
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
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
            {error && <Alert message={error} type="error" showIcon />}
            <div className='EmailText'>Email</div>
            <Form.Item className='emailInput'
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'The input is not a valid email!' },
              ]}
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
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
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
              <Button htmlType="submit" className="login-button" disabled={loading}>
                {loading ? <Spin /> : 'Login now'}
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
        <img src={sideSvgImage} alt="Left Side Design" />
      </div>
    </div>
  );
};

export default Login;
