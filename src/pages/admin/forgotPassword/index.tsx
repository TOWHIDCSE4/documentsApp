import { useState } from 'react'
import Layout from '@src/layouts/Login'
import { LeftCircleFilled, MailOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col } from 'antd'
import authService from '@src/services/authService'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()

const Index = () => {
  const { t, redirect, notify, router } = useBaseHook()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    setLoading(true)
    let [error, result]: any[] = await to(authService().forgotPassword({ data: values }))
    setLoading(false)
    if (error) return notify(t(`errors:${error.code}`), '', 'error')
    notify(t('messages:message.forgotPasswordSuccess'))
    redirect('frontend.admin.login')
    return result
  }

  return <>
    <div className="content-form">
      <div className="logo">
        <div className="img">
          <img src={publicRuntimeConfig.LOGO}></img>
        </div>
        <div className="sitename">{t('pages:forgotPassword.content')}</div>
      </div>
      <Form
        onFinish={onFinish}
        form={form}
        name="forgotPasswordForm"
        layout="horizontal"
        initialValues={{
          email: ""
        }}
      >
        <Col md={24} sm={24} xs={24}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('messages:form.required', {name: t('pages:forgotPassword.email')}) },
              { type: 'email', message: t('messages:form.email') },
              { max: 255, message: t('messages:form.maxLength', { name: t('pages:forgotPassword.email'), length: 255 }) }
            ]}
          >
            <Input
              placeholder={t('pages:forgotPassword.email')}
              type="email"
              prefix={<MailOutlined />}
            />
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24}>
          <Form.Item>
            <Row gutter={12}>
              <Col md={12} sm={12} xs={12}>
                <Button className="btn login" type="primary" htmlType="submit" loading={loading}>
                  <SendOutlined />
                  {t('buttons:forgotPassword')}
                </Button>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <Button
                  className="btn back"
                  type="default"
                  onClick={() => router.back()}
                >
                  <LeftCircleFilled /> {t('buttons:back')}
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
    title={t('pages:forgotPassword.title')}
    description={t('pages:forgotPassword.description')}
    {...props}
  />
}

export default Index
