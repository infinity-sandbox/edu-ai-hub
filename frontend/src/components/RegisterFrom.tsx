import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload, Select } from 'antd';
import { BookOutlined, HomeOutlined, QuestionCircleOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../styles/RegisterForm.css';
import logo from "../images/logo.svg";

const { Option } = Select;

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [school, setSchool] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [books, setBooks] = useState([]);
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [profilePicture, setProfilePicture] = useState<any>(null);

  const onFinish = () => {
    const registerData = {
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
      parentName,
      parentEmail,
      school,
      classLevel,
      agreeToTerms,
      books,
      birthdate,
      address,
      securityQuestion,
      securityAnswer,
      profilePicture,
    };
    console.log('Register data: ', registerData);
    axios.post('/', registerData)
      .then(result => console.log(result))
      .catch(err => console.log(err));

    // Create JSON object
    const json = JSON.stringify(registerData, null, 2);

    // Create a blob from the JSON object and save it as a file
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'registerData.json');
  };

  return (
    <div className='RegisterPageAll'>
      <div className="left-side"></div>
      <div className="register-container">
        {/* <div className="logo">
          <img src={logo} />
          
        </div> */}
        <Form
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
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }
              , { type: 'email', message: 'Please enter a valid Email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
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
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            rules={[{ required: true, message: 'Please input your Birthdate!' }]}
          >
            <DatePicker placeholder='Enter Birthdate' style={{ width: '100%' }} onChange={(date, dateString) => setBirthdate(dateString as string)} />
          </Form.Item>

          <Form.Item
            name="parentName"
            rules={[{ required: true, message: 'Please input your Parent Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              
              placeholder="Parent Name"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="parentEmail"
            rules={[{ required: true, message: 'Please input your Parent Email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Parent Email"
              value={parentEmail}
              onChange={e => setParentEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="school"
            rules={[{ required: true, message: 'Please input your School!' }]}
          >
            <Input
              prefix={<BookOutlined />}
              placeholder="School"
              value={school}
              onChange={e => setSchool(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="classLevel"
            rules={[{ required: true, message: 'Please input your Class!' }]}
          >
            <Select
              placeholder="Select your class"
              value={classLevel}
              onChange={value => setClassLevel(value)}
              className='registration-class'
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
            name="books"
            rules={[{ required: true, message: 'Please input your Books!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select your books"
              value={books}
              onChange={value => setBooks(value)}
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
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="securityQuestion"
            rules={[{ required: true, message: 'Please input your Security Question!' }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder="Security Question"
              value={securityQuestion}
              onChange={e => setSecurityQuestion(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="securityAnswer"
            rules={[{ required: true, message: 'Please input your Security Answer!' }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={e => setSecurityAnswer(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="profilePicture"
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
            <Checkbox
              checked={agreeToTerms}
              onChange={e => setAgreeToTerms(e.target.checked)}
            >
              I agree to the terms and conditions
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className="register-button">
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
