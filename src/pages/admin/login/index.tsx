import { useState } from 'react'
import dynamic from 'next/dynamic'
import { LeftOutlined } from '@ant-design/icons';
import authService from '@src/services/authService'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook';
import auth from '@src/helpers/auth'
import LoginComponent from '@src/components/GeneralComponents/Login'

const Layout = dynamic(() => import('@src/layouts/Login'), { ssr: false })

const Login = () => {
  const { t, notify, redirect, getData, setStore } = useBaseHook()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)

    let [error, result]: any[] = await to(authService().login(values))
    setLoading(false)

    if (error) return notify(t('messages:message.loginFailed'), t(`errors:${error.code}`), 'error')

    auth().setAuth(result)

    notify(t('messages:message.loginSuccess'))
    redirect('frontend.admin.documents.index')

    return result
  }

  return <LoginComponent
    onSubmit={onFinish}
    loading={loading}
    link="frontend.admin.documents"
    icon={<LeftOutlined />}
    text="home"
  />
}

Login.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t('pages:login.title')}
    description={t('pages:login.description')}
    {...props}
  />
}

export default Login
