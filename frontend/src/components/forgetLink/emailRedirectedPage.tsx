// src/pages/PasswordResetPage.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

const { Title } = Typography;

const PasswordResetPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Received values of form: ', values);

    axios.post(baseUrl + '/api/v1/users/reset/password/confirm', { token, new_password: values.password })
      .then(response => {
        setLoading(false);
        console.log('Password reset successful:', response.data);
        setResetSuccess(true);
        setIsSubmitted(true);
        message.success(t('passwordReset.reset_successful'));
      })
      .catch(error => {
        setLoading(false);
        setResetSuccess(false);
        setIsSubmitted(false);
        console.error('Password reset failed:', error);
        message.error(t('passwordReset.reset_failed'));
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
            {t('passwordReset.reset_password')}
          </Title>
        )}
        {!isSubmitted ? (
          <Form name="reset_password" onFinish={onFinish}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('passwordReset.password_required') }]}
            >
              <Input.Password placeholder={t('passwordReset.new_password')} />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: t('passwordReset.confirm_password_required') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('passwordReset.passwords_not_match')));
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t('passwordReset.confirm_password')} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="reset-submit-button" loading={loading}>
                {t('passwordReset.submit')}
              </Button>
            </Form.Item>
          </Form>
        ) : (isSubmitted && resetSuccess) ? (
          <div>
            <Title level={3} style={{ color: '#353935' }}>
              {t('passwordReset.reset_successful')}
            </Title>
            <Button type="primary" onClick={handleRedirectToLogin} className="reset-login-button">
              {t('passwordReset.go_to_login')}
            </Button>
          </div>
        ) : (
            <div>
                <Title level={3} style={{ color: '#353935' }}>
                    {t('passwordReset.submitting')}
                </Title>
            </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetPage;
