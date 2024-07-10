import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload, Select, message } from 'antd';
import { BookOutlined, HomeOutlined, QuestionCircleOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../styles/RegisterForm.css';
import logo from "../images/logo.svg";

const { Option } = Select;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<any>(null);

  const onFinish = (values: any) => {
    setLoading(true);
    const registerData = {
      ...values,
      birthdate: values.birthdate ? values.birthdate.format('YYYY-MM-DD') : '',
      upload_photo: profilePicture,
    };

    axios.post('http://0.0.0.0:8000/api/v1/users/register', registerData)
      .then(_result => {
        message.success('Registration successful');
        navigate('/statusPages/SuccessRegistrationPage');
      })
      .catch(err => {
        message.error('Registration failed. Please try again.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='RegisterPageAll'>
      <div className="left-side"></div>
      <div className="register-container">
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          className="register-form"
        >
          <h1 className='createAccount'>Create your account</h1>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid Email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
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
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            rules={[{ required: true, message: 'Please input your Birthdate!' }]}
          >
            <DatePicker placeholder='Enter Birthdate' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="parent_name"
            rules={[{ required: true, message: 'Please input your Parent Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Parent Name"
            />
          </Form.Item>

          <Form.Item
            name="parent_email"
            rules={[{ required: true, message: 'Please input your Parent Email!' }, { type: 'email', message: 'Please enter a valid Email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Parent Email"
            />
          </Form.Item>

          <Form.Item
            name="school"
            rules={[{ required: true, message: 'Please input your School!' }]}
          >
            <Input
              prefix={<BookOutlined />}
              placeholder="School"
            />
          </Form.Item>

          <Form.Item
            name="user_class"
            rules={[{ required: true, message: 'Please input your Class!' }]}
          >
            <Select
              placeholder="Select your class"
            >
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
            name="user_subject"
            rules={[{ required: true, message: 'Please input your Books!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select your books"
            >
              <Option value="Math">Math</Option>
              <Option value="Science">Science</Option>
              <Option value="English">English</Option>
              <Option value="History">History</Option>
              <Option value="Geography">Geography</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please input your Address!' }]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Address"
            />
          </Form.Item>

          <Form.Item
            name="security_question"
            rules={[{ required: true, message: 'Please input your Security Question!' }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder="Security Question"
            />
          </Form.Item>

          <Form.Item
            name="security_answer"
            rules={[{ required: true, message: 'Please input your Security Answer!' }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder="Security Answer"
            />
          </Form.Item>

          <Form.Item
            name="upload_photo"
            rules={[{ required: true, message: 'Please upload your Profile Picture!' }]}
          >
            <Upload
              beforeUpload={file => {
                setProfilePicture(file);
                return false;
              }}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')) }]}
          >
            <Checkbox>
              I agree to the terms and conditions
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className="register-button" loading={loading}>
              Create account
            </Button>
          </Form.Item>
          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
