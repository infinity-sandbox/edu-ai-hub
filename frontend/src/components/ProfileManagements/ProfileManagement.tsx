import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import '../../styles/ProfileManagements.css';

interface UserInfo {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  parentName: string;
  parentEmail: string;
  school: string;
  classLevel: string;
  agreeToTerms: boolean;
  books: string;
  birthdate: string;
  address: string;
  securityQuestion: string;
  securityAnswer: string;
  profilePicture: string;
}

const ProfileManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    parentName: '',
    parentEmail: '',
    school: '',
    classLevel: '',
    agreeToTerms: false,
    books: '',
    birthdate: '',
    address: '',
    securityQuestion: '',
    securityAnswer: '',
    profilePicture: ''
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const fetchedUserInfo: UserInfo = {
      username: 'john_doe',
      email: 'john@example.com',
      password: '',
      confirmPassword: '',
      phoneNumber: '1234567890',
      parentName: 'Jane Doe',
      parentEmail: 'jane@example.com',
      school: 'XYZ High School',
      classLevel: '10th Grade',
      agreeToTerms: true,
      books: 'Math, Science',
      birthdate: '2004-05-14',
      address: '123 Main St',
      securityQuestion: 'What is your pet\'s name?',
      securityAnswer: 'Fluffy',
      profilePicture: ''
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
      <Form.Item name="username" label="Username">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input />
      </Form.Item>
      
      <Form.Item name="phoneNumber" label="Phone Number">
        <Input />
      </Form.Item>
      <Form.Item name="parentName" label="Parent Name">
        <Input />
      </Form.Item>
      <Form.Item name="parentEmail" label="Parent Email">
        <Input />
      </Form.Item>
      <Form.Item name="school" label="School">
        <Input />
      </Form.Item>
      <Form.Item name="classLevel" label="Class Level">
        <Input />
      </Form.Item>
      <Form.Item name="birthdate" label="Birthdate">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
      <Form.Item name="securityQuestion" label="Security Question">
        <Input />
      </Form.Item>
      <Form.Item name="securityAnswer" label="Security Answer">
        <Input />
      </Form.Item>
     
      {isEdited && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProfileManagement;
