import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form } from 'antd';
import roleService from '@src/services/roleService';
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled } from '@ant-design/icons';
import RoleForm from '@src/components/Admin/Roles/RoleForm';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const Create = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    let [error, result]: any[] = await to(roleService().withAuth().create(values));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordRoleCreated"))
    redirect("frontend.admin.roles.index")
  }

  return (
    <div className="content">
      <Form
        {...formItemLayout}
        form={form}
        name="createRole"
        initialValues={{
          name: "",
          description: "",
          parentId: undefined
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <RoleForm />
        <Form.Item wrapperCol={{ span: 24 }} className="text-center">
          <Button onClick={() => router.back()} className="btn-margin-right">
            <LeftCircleFilled /> {t('buttons:back')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="btn-margin-right">
            <SaveFilled /> {t('buttons:submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

Create.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:roles.create.title")}
    description={t("pages:roles.create.description")}
    {...props}
  />
}

Create.permissions = {
  "roles": "C"
}

export default Create