import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload, Select, message } from 'antd';
import { BookOutlined, HomeOutlined, QuestionCircleOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../styles/ProfileManagement.css';
import ProfileMangementSVG from '../../images/ProfileMangementSVG.svg'

const { Option } = Select;

const ProfileManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error('Failed to load profile data');
      }
    };
    fetchProfile();
  }, [form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await axios.put('/api/profile', values);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='profile-page'>
      <div className="profile-container">
        <Form
          form={form}
          name="profile"
          onFinish={handleSave}
          className="profile-form"
          layout="vertical"
        >
          <h1 className='profile-title'>Your Profile</h1>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid Email!' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your Password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="birthdate"
            label="Birthdate"
            rules={[{ required: true, message: 'Please input your Birthdate!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="parentName"
            label="Parent Name"
            rules={[{ required: true, message: 'Please input your Parent Name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="parentEmail"
            label="Parent Email"
            rules={[{ required: true, message: 'Please input your Parent Email!' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="school"
            label="School"
            rules={[{ required: true, message: 'Please input your School!' }]}
          >
            <Input prefix={<BookOutlined />} />
          </Form.Item>

          <Form.Item
            name="classLevel"
            label="Class Level"
            rules={[{ required: true, message: 'Please input your Class!' }]}
          >
            <Select>
              <Option value="P1">P1</Option>
              <Option value="P2">P2</Option>
              <Option value="P3">P3</Option>
              <Option value="P4">P4</Option>
              <Option value="P5">P5</Option>
              <Option value="P6">P6</Option>
              <Option value="S1">S1</Option>
              <Option value="S2">S2</Option>
              <Option value="S3">S3</Option>
              <Option value="S4">S4</Option>
              <Option value="S5">S5</Option>
              <Option value="S6">S6</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="books"
            label="Books"
            rules={[{ required: true, message: 'Please input your Books!' }]}
          >
            <Select mode="multiple">
              <Option value="Math">Math</Option>
              <Option value="Science">Science</Option>
              <Option value="English">English</Option>
              <Option value="History">History</Option>
              <Option value="Geography">Geography</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input your Address!' }]}
          >
            <Input prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item
            name="securityQuestion"
            label="Security Question"
            rules={[{ required: true, message: 'Please input your Security Question!' }]}
          >
            <Input prefix={<QuestionCircleOutlined />} />
          </Form.Item>

          <Form.Item
            name="securityAnswer"
            label="Security Answer"
            rules={[{ required: true, message: 'Please input your Security Answer!' }]}
          >
            <Input prefix={<QuestionCircleOutlined />} />
          </Form.Item>

          <Form.Item
            name="profilePicture"
            label="Profile Picture"
          >
            <Upload
              beforeUpload={file => {
                // Custom logic for handling file upload
                return false;
              }}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button style={{backgroundColor:'#59B379'}} type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
       <div className="ProfileMangementSVG">
        <img src={ProfileMangementSVG} alt="ProfileMangement SVG" />
      </div>
    </div>
  );
};

export default ProfileManagement;
