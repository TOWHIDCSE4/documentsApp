import { useState, useEffect } from 'react'
import Layout from '@src/layouts/Login'
import { LockOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col } from 'antd'
import authService from '@src/services/authService'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook';
import validatorHook from '@src/hooks/ValidatorHook';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()

const Index = () => {
  const { t, redirect, notify, router } = useBaseHook()
  const {validatorRePassword, CustomRegex} = validatorHook()
  const [token, setToken]: any[] = useState();
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { query } = router

  const fetchData = async() => {
    let [userError, user]: any[] = await to(authService().checkToken({data: query}))
    if(userError) return notify(t(`errors:${userError.code}`), '', 'error')
    setToken(query.token)
    return user
  }

  useEffect(() => {
    fetchData()
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true)
    let data = { token: token, ...values }
    let [error, result]: any[] = await to(authService().resetPassword({data}))
    setLoading(false)
    if (error) return notify(t(`errors:${error.code}`), error.message, 'error')
    notify(t('messages:message.resetPasswordSuccess'))
    redirect('frontend.admin.login')
    return result
  }

  return <>
    <div className="content-form">
      <div className="logo">
        <div className="img">
          <img src={publicRuntimeConfig.LOGO}></img>
        </div>
        <div className="sitename">{t('pages:resetPassword.content')}</div>
      </div>
      <Form
        onFinish={onFinish}
        form={form}
        name="resetPasswordForm"
        layout="horizontal"
        initialValues={{
          newPassword: "",
          reNewPassword: ""
        }}
      >
        <Col md={24} sm={24} xs={24}>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: t('messages:form.required', {name: t('pages:resetPassword.newPassword')}) },
              { min: 6, message: t('messages:form.minLength', { name: t('pages:resetPassword.newPassword'), length: 6 }) },
              { max: 100, message: t('messages:form.maxLength', { name: t('pages:resetPassword.newPassword'), length: 100 }) },
              CustomRegex({
                length: 6,
                reGex: '^[A-Za-z]\\w{5,100}$',
                message: t('messages:form.newPassword')
              })
            ]}
          >
            <Input.Password
              placeholder={t('pages:resetPassword.newPassword')}
              prefix={<LockOutlined />}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24}>
          <Form.Item
            name="reNewPassword"
            rules={[
              { required: true, message: t('messages:form.required', {name: t('pages:resetPassword.reNewPassword')}) },
              validatorRePassword({
                key: 'newPassword',
                message: t('messages:form.reNewPassword'),
                getFieldValue: form.getFieldValue
              })
            ]}
          >
            <Input.Password
              placeholder={t('pages:resetPassword.reNewPassword')}
              prefix={<LockOutlined />}
              autoComplete="off"
            />
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24}>
          <Form.Item>
            <Row gutter={12}>
              <Col md={12} sm={12} xs={12}>
                <Button className="btn login" type="primary" htmlType="submit" loading={loading}>
                  <SendOutlined />
                  {t('buttons:resetPassword')}
                </Button>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <Button
                  className="btn home"
                  type="default"
                  onClick={() => redirect("frontend.admin.login")}
                >
                  {t('buttons:cancel')}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Form>
    </div>
  </>
}

Index.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout
    title={t('pages:resetPassword.title')}
    description={t('pages:resetPassword.description')}
    {...props}
  />
}

export default Index
