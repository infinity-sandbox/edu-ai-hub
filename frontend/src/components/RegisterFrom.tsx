import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Upload, Select, message } from 'antd';
import { BookOutlined, HomeOutlined, QuestionCircleOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../styles/RegisterForm.css';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const Register: React.FC = () => {
  const { t } = useTranslation();
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
        message.success(t('register.registration_successful'));
        navigate('/login');
      })
      .catch(err => {
        message.error(t('register.registration_failed'));
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

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
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          className="register-form"
        >
          <h1 className='createAccount'>{t('register.create_account')}</h1>

          <Form.Item
            name="username"
            rules={[{ required: true, message: t('register.username_required') }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('register.username')}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: t('register.email_required') }, { type: 'email', message: t('register.email_invalid') }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder={t('register.email')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t('register.password_required') }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder={t('register.password')}
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: t('register.confirm_password_required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('register.passwords_do_not_match')));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder={t('register.confirm_password')}
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: t('register.phone_number_required') }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder={t('register.phone_number')}
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            rules={[{ required: true, message: t('register.birthdate_required') }]}
          >
            <DatePicker placeholder={t('register.birthdate')} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="parent_name"
            rules={[{ required: true, message: t('register.parent_name_required') }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('register.parent_name')}
            />
          </Form.Item>

          <Form.Item
            name="parent_email"
            rules={[{ required: true, message: t('register.parent_email_required') }, { type: 'email', message: t('register.parent_email_invalid') }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder={t('register.parent_email')}
            />
          </Form.Item>

          <Form.Item
            name="school"
            rules={[{ required: true, message: t('register.school_required') }]}
          >
            <Input
              prefix={<BookOutlined />}
              placeholder={t('register.school')}
            />
          </Form.Item>

          <Form.Item
            name="user_class"
            rules={[{ required: true, message: t('register.class_required') }]}
          >
            <Select
              placeholder={t('register.class')}
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
            rules={[{ required: true, message: t('register.books_required') }]}
          >
            <Select
              mode="multiple"
              placeholder={t('register.books')}
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
            rules={[{ required: true, message: t('register.address_required') }]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder={t('register.address')}
            />
          </Form.Item>

          <Form.Item
            name="security_question"
            rules={[{ required: true, message: t('register.security_question_required') }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder={t('register.security_question')}
            />
          </Form.Item>

          <Form.Item
            name="security_answer"
            rules={[{ required: true, message: t('register.security_answer_required') }]}
          >
            <Input
              prefix={<QuestionCircleOutlined />}
              placeholder={t('register.security_answer')}
            />
          </Form.Item>

          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(t('register.agree_to_terms_required'))) }]}
          >
            <Checkbox>
              {t('register.agree_to_terms')}
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className="register-button" loading={loading}>
              {t('register.create_account_button')}
            </Button>
          </Form.Item>
          <div className="login-link">
            {t('register.already_have_account')} <Link to="/login">{t('register.login')}</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
