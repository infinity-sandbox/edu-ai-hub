import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const { Title } = Typography;

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Received values of form: ', values);

    axios.post(baseUrl + '/api/v1/users/resetpassword/confirm', { token, new_password: values.password })
      .then(response => {
        setLoading(false);
        console.log('Password reset successful:', response.data);
        setResetSuccess(true);
        setIsSubmitted(true); // Set isSubmitted to true after successful reset
        message.success('Password reset successful!');
      })
      .catch(error => {
        setLoading(false);
        setResetSuccess(false);
        setIsSubmitted(false);
        console.error('Password reset failed:', error);
        message.error('Failed to reset password. Please try again.');
      });
  };

  const handleRedirectToLogin = () => {
    navigate('/Login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '300px', textAlign: 'center' }}>
        {!isSubmitted && (
          <Title level={2} style={{ marginBottom: '20px', color: '#353935' }}>
            Reset Password
          </Title>
        )}
        {!isSubmitted ? (
          <Form name="reset_password" onFinish={onFinish}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm New Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="reset-submit-button" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : (isSubmitted && resetSuccess) ? (
          <div>
            <Title level={3} style={{ color: '#353935' }}>
              Password reset successful!
            </Title>
            <Button type="primary" onClick={handleRedirectToLogin} className="reset-login-button">
              Go to Login
            </Button>
          </div>
        ) : (
            <div>
                <Title level={3} style={{ color: '#353935' }}>
                    Submitting...
                </Title>
            </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetPage;
