import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BACKEND_API_URL;


const { Option } = Select;


interface UserInfo {
  username: string;
  phone_number: string;
  birthdate: string;
  parent_name: string;
  parent_email: string;
  school: string;
  user_class: string;
  user_subject: string[];
  address: string;
  security_question: string;
  security_answer: string;
}

const ProfileManagement: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    // Fetch tokens from local storage
    
    // Make sure accessToken exists
    if (!accessToken) {
        // Handle case where accessToken is missing (e.g., redirect to login)
        navigate('/login')
        return;
      }

    // Fetch user data from backend
    axios.get(baseUrl + '/api/v1/users/profileview', {
        params: {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    })
      .then(response => setUserInfo(response.data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleFinish = (values: UserInfo) => {
    axios.put(`${baseUrl}/api/v1/users/profile`, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Refresh-Token': refreshToken,
          'Content-Type': 'application/json'
        }
      })
      .catch(error => console.error('Error updating user data:', error));
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isEditing ? (
        <div>
          <h2>Profile View</h2>
          <p>Username: {userInfo.username}</p>
          <p>Phone Number: {userInfo.phone_number}</p>
          <p>Birthdate: {userInfo.birthdate}</p>
          <p>Parent Name: {userInfo.parent_name}</p>
          <p>Parent Email: {userInfo.parent_email}</p>
          <p>School: {userInfo.school}</p>
          <p>Class: {userInfo.user_class}</p>
          <p>Subjects: {userInfo.user_subject.join(', ')}</p>
          <p>Address: {userInfo.address}</p>
          <p>Security Question: {userInfo.security_question}</p>
          <p>Security Answer: {userInfo.security_answer}</p>
          <Button type="primary" onClick={handleEditClick}>Edit</Button>
        </div>
      ) : (
        <Form
          initialValues={userInfo}
          onFinish={handleFinish}
          layout="vertical"
        >
          <h2>Edit Profile</h2>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="Birthdate"
            rules={[{ required: true, message: 'Please input your birthdate!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_name"
            label="Parent Name"
            rules={[{ required: true, message: 'Please input your parent name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_email"
            label="Parent Email"
            rules={[{ required: true, message: 'Please input your parent email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="school"
            label="School"
            rules={[{ required: true, message: 'Please input your school!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_class"
            label="Class"
            rules={[{ required: true, message: 'Please input your class!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_subject"
            label="Subjects"
            rules={[{ required: true, message: 'Please select your subjects!' }]}
          >
            <Select mode="multiple">
              <Option value="Math">Math</Option>
              <Option value="Science">Science</Option>
              <Option value="History">History</Option>
              {/* Add more options as needed */}
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="security_question"
            label="Security Question"
            rules={[{ required: true, message: 'Please input your security question!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="security_answer"
            label="Security Answer"
            rules={[{ required: true, message: 'Please input your security answer!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={handleCancelClick} style={{ marginLeft: '10px' }}>Cancel</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default ProfileManagement;
