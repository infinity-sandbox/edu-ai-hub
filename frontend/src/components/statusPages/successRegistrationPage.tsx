import React from 'react';
import { Result, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/statusPages/SuccessRegistrationPage.css'; // Import your CSS file for styling

const SuccessRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="success-container">
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} />}
        title="You are successfully registered!"
        subTitle="For the upcoming September class."
        extra={
          <Button className='success-login-button' type="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        }
      />
    </div>
  );
};

export default SuccessRegistrationPage;
