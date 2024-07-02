import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../styles/RegisterForm.css';
import creatAccImg from "../images/RegisterPageImage.png"


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
  const [books, setBooks] = useState('');
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
    axios.post('https://jsonplaceholder.typicode.com/posts', registerData)
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
       <div className="left-side">
         <img src= {creatAccImg} alt="Left Side Design" />
       </div>
    <div className="register-container">
     
      <Form
        name="register"
        onFinish={onFinish}
        className="register-form"
      >
        <h1>Create your account</h1>
        
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
          ,{ type: 'email', message: 'Please enter a valid Email!' }
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
          rules={[{ required: true, message: 'Please input your Password!' },
          ]}
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
       <Form.Item name="birthdate" rules={[{ required: true, message: 'Please input your Birthdate!' }]}>
  <DatePicker placeholder='Enter Birthdate' style={{ width: '100%' }} onChange={(date, dateString) => setBirthdate(dateString as string)} />
</Form.Item>
        <Form.Item
          name="parentName"
          rules={[{ required: true, message: 'Please input your Parent Name!' }]}
        >
          <Input
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
            placeholder="School"
            value={school}
            onChange={e => setSchool(e.target.value)}
          />
        </Form.Item>
        
        <Form.Item
          name="classLevel"
          rules={[{ required: true, message: 'Please input your Class!' }]}
        >
          <Input
            placeholder="Class"
            value={classLevel}
            onChange={e => setClassLevel(e.target.value)}
          />
          </Form.Item>
          <Form.Item
          name="books"
          rules={[{ required: true, message: 'Please input your Books!' }]}
        >
          <Input
            placeholder="Books"
            value={books}
            onChange={e => setBooks(e.target.value)}
          />
        </Form.Item>
          <Form.Item
          name="address"
          rules={[{ required: true, message: 'Please input your Address!' }]}
        >
          <Input
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
          rules={[{ validator:(_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')) }]}
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
