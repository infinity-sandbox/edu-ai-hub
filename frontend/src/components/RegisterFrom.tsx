import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css';
import '../styles/RegisterForm.css';

const { Step } = Steps;

const RegisterFrom: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    axios.post('/api/register', values)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const validatePassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords do not match!'));
    },
  });

  const steps = [
    {
      title: 'User Info',
      content: (
        <div>
          <Form.Item
            name="username"
            label="Username"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            className="form-item-label"
            dependencies={['password']}
            hasFeedback
            rules={[{ required: true, message: 'Please confirm your password!' }, validatePassword]}
          >
            <Input.Password />
          </Form.Item>
          <div className="form-navigation-buttons">
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Additional Info',
      content: (
        <div>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentName"
            label="Parent Name"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your parent\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentEmail"
            label="Parent Email"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your parent\'s email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="Birthdate"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your birthdate!' }]}
          >
            <DatePicker />
          </Form.Item>
          <div className="form-navigation-buttons">
            <Button onClick={() => prev()}>
              Previous
            </Button>
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'School Info',
      content: (
        <div>
          <Form.Item
            name="address"
            label="Address"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="school"
            label="School"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your school!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="class"
            label="Class"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your class!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="books"
            label="Books"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your books!' }]}
          >
            <Input />
          </Form.Item>
          <div className="form-navigation-buttons">
            <Button onClick={() => prev()}>
              Previous
            </Button>
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Personal Info',
      content: (
        <div>
          <Form.Item
            name="securityQuestion"
            label="Security Question"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your security question!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="securityAnswer"
            label="Security Answer"
            className="form-item-label"
            rules={[{ required: true, message: 'Please input your security answer!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="profilePicture"
            label="Profile Picture"
            className="form-item-label"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload name="profile" listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[{ required: true, message: 'Please agree to the terms!' }]}
          >
            <Checkbox>I agree to the terms and conditions</Checkbox>
          </Form.Item>
          <div className="form-navigation-buttons">
            <Button onClick={() => prev()}>
              Previous
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="registration-form">
      <div className="form-title">Create an Account</div>
      <Form name="register" onFinish={onFinish} scrollToFirstError>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
      </Form>
    </div>
  );
};

export default RegisterFrom;
