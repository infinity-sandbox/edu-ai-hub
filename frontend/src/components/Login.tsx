import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import sideSvgImage from '../images/image1.svg'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    useColorModeValue,
    useToast,
  } from "@chakra-ui/react";


const Login: React.FC = () => {
  const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const onSubmit = async () => {
    try {
      await login(email, password);
    } catch (error) {
      toast({
        title: "Invalid email or password",
        status: "error",
        isClosable: true,
        duration: 1500,
      });
    }
  };



  return (
    <div className='LoginPage'>
      
    <div className="login-container">
      <div>
       {/* <div className="logo">
          <img src={logo} />
        </div> */}
     <div>
      <Form
        name="login"
        onFinish={onSubmit}
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
          <span>Don't have an account?</span>{" "}
          <Link to="/Register">Register</Link>
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
