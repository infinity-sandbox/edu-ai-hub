// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ForgotPassword.css';

const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const onFinish = (values: { email: string }) => {
    setLoading(true);
    console.log('Received values of form: ', values);
    setSubmittedEmail(values.email);

    axios.post(baseUrl + '/api/v1/users/email/reset', { email: values.email })
      .then(response => {
        setLoading(false);
        console.log('Password reset email sent successfully:', response.data);
        message.success(t('forgotPassword.email_sent_success'));
        setResetSuccess(true);
      })
      .catch(error => {
        setLoading(false);
        console.error('Failed to send password reset email:', error);
        message.error(t('forgotPassword.send_failed'));
        setResetSuccess(false);
      });
  };

  return (
    <div className="forgot-password-container">
      {submittedEmail && resetSuccess ? (
        <div>
          <Title level={2} style={{ color: '#353935' }}>{t('forgotPassword.check_email')}</Title>
          <p style={{ color: '#353935' }}>{t('forgotPassword.reset_link_sent', { email: submittedEmail })}</p>
        </div>
      ) : (
        <>
          <Title level={2} className="forgot-password-heading" style={{ color: '#353935' }}>{t('forgotPassword.forgot_password')}</Title>
          <Form
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              label={t('forgotPassword.input_email')}
              rules={[{ required: true, message: t('forgotPassword.email_required') }]}
            >
              <Input
                className="email-input"
                placeholder={t('forgotPassword.enter_email')}
                style={{ border: "1px solid #d9d9d9", borderRadius: "5rem" }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="forgot-password-button green-button" loading={loading}>
                {t('forgotPassword.submit')}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
