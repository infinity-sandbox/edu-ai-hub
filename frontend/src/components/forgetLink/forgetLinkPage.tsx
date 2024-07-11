// ForgotPassword.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../styles/ForgotPassword.css';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BACKEND_API_URL;


const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false); // State to track reset success

  const onFinish = (values: { email: string }) => {
    setLoading(true);
    console.log('Received values of form: ', values);
    setSubmittedEmail(values.email);
    
    axios.post(baseUrl + '/api/v1/users/emailreset', { email: values.email })
      .then(response => {
        setLoading(false);
        console.log('Password reset email sent successfully:', response.data);
        message.success('Password reset email sent successfully');
        setResetSuccess(true); // Set reset success state
      })
      .catch(error => {
        setLoading(false);
        console.error('Failed to send password reset email:', error);
        message.error('Failed to send password reset email. Please try again.');
        setResetSuccess(false); // Reset success state on error
      });
  };

  return (
    <div className="forgot-password-container">
      {submittedEmail && resetSuccess ? (
        <div>
          <Title level={2} style={{ color: '#353935' }}>Check your email</Title>
          <p style={{ color: '#353935' }}>A reset link has been sent to {submittedEmail}</p>
        </div>
      ) : (
        <>
          <Title level={2} className="forgot-password-heading" style={{ color: '#353935' }}>Forgot Password</Title>
          <Form
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              label="Input your email here"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input 
              className="email-input" 
              placeholder="Enter your email"
              style={{ border: "1px solid #d9d9d9", borderRadius: "5rem" }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="forgot-password-button green-button" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
