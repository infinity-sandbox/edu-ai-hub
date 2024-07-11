import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import '../../styles/ProfileManagements.css';
import { useTranslation } from 'react-i18next';

interface UserInfo {
  username: string;
  email: string;
  phoneNumber: string;
  parentName: string;
  parentEmail: string;
  school: string;
  classLevel: string;
  birthdate: string;
  address: string;
  securityQuestion: string;
  securityAnswer: string;

}

const ProfileManagement: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    email: '',
    phoneNumber: '',
    parentName: '',
    parentEmail: '',
    school: '',
    classLevel: '',
    
    birthdate: '',
    address: '',
    securityQuestion: '',
    securityAnswer: '',
  // profilePicture: ''
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchedUserInfo: UserInfo = {
      username: 'john_doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      parentName: 'Jane Doe',
      parentEmail: 'jane@example.com',
      school: 'XYZ High School',
      classLevel: '10th Grade',
      birthdate: '2004-05-14',
      address: '123 Main St',
      securityQuestion: 'What is your pet\'s name?',
      securityAnswer: 'Fluffy',
      //profilePicture: ''
    };
    setUserInfo(fetchedUserInfo);
    form.setFieldsValue(fetchedUserInfo);
  }, [form]);

  const onValuesChange = () => {
    setIsEdited(true);
  };

  const handleSubmit = (values: UserInfo) => {
    console.log('Updated User Info:', values);
    setIsEdited(false);
  };

  return (
    <Form
      className='formProfileManage'
      form={form}
      layout="vertical"
      initialValues={userInfo}
      onValuesChange={onValuesChange}
      onFinish={handleSubmit}
    >
      <h1 style={{ textAlign: 'center' }}>{t('profile_management.view_profile')}</h1>
      <Form.Item name="username" label={t('profile_management.username')}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label={t('profile_management.email')}>
        <Input />
      </Form.Item>
      <Form.Item name="phoneNumber" label={t('profile_management.phone_number')}>
        <Input />
      </Form.Item>
      <Form.Item name="parentName" label={t('profile_management.parent_name')}>
        <Input />
      </Form.Item>
      <Form.Item name="parentEmail" label={t('profile_management.parent_email')}>
        <Input />
      </Form.Item>
      <Form.Item name="school" label={t('profile_management.school')}>
        <Input />
      </Form.Item>
      <Form.Item name="classLevel" label={t('profile_management.class_level')}>
        <Input />
      </Form.Item>
      <Form.Item name="birthdate" label={t('profile_management.birthdate')}>
        <Input />
      </Form.Item>
      <Form.Item name="address" label={t('profile_management.address')}>
        <Input />
      </Form.Item>
      <Form.Item name="securityQuestion" label={t('profile_management.security_question')}>
        <Input />
      </Form.Item>
      <Form.Item name="securityAnswer" label={t('profile_management.security_answer')}>
        <Input />
      </Form.Item>
      {isEdited && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('profile_management.submit')}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProfileManagement;
