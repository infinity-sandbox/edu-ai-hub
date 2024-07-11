import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sideSvgImage from '../images/image1.svg';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');          
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const onFinish = async (values: any) => {
    const loginData = new URLSearchParams();
    
    loginData.append('username', values.email);
    loginData.append('password', values.password);

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://0.0.0.0:8000/api/v1/auth/login', loginData);
      const { token } = response.data;

      // Save JWT to local storage
      localStorage.setItem('token', token);

      // Redirect to another page after successful login
      navigate('/index');
    } catch (err) {
      setError(t('login.invalid_credentials'));
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
            <h1 className='loginLeable'>{t('login.login_label')}</h1>
            {error && <Alert message={error} type="error" showIcon />}
            <div className='EmailText'>{t('login.email')}</div>
            <Form.Item className='emailInput'
              name="email"
              rules={[
                { required: true, message: t('login.email_required') },
                { type: 'email', message: t('login.email_invalid') },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                className='emailInput'
                placeholder={t('login.email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>
            <div className='PasswordText'>
              <div>{t('login.password')}</div>
              <div className="forgot-link">
                <a href="#">{t('login.forgot')}</a>
              </div>
            </div>
            <Form.Item className='passwordInput'
              name="password"
              rules={[
                { required: true, message: t('login.password_required') },
                { min: 6, message: t('login.password_min') },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder={t('login.password')}
                className='passwordInput'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="login-button" disabled={loading}>
                {loading ? <Spin /> : t('login.login_now')}
              </Button>
            </Form.Item>
            <div className="signup-link">
              <span>{t('login.dont_have_account')}</span>{" "}
              <Link to="/Register">{t('login.register')}</Link>
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
