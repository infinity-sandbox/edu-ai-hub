// src/Login.tsx
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';



const Login: React.FC = () => {
  const [email,setEmail] =useState();
  const [password,setPassword] =useState();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    axios.post('https://jsonplaceholder.typicode.com/posts',{values})
    .then(result => console.log(result))
    .catch(err => console.log(err))
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        onFinish={onFinish}
        className="login-form"
      >
        <h1>Login</h1>
        <div className='EmailText'>Email</div>
        <Form.Item className='emailInput'
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input prefix={<UserOutlined />} className='emailInput' placeholder="Email" />
        </Form.Item>
        <div className='PasswordText'>
        <div>password </div>
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
            placeholder="Password" className='passwordInput'
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
  );
};

export default Login;
