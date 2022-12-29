import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form, Spin } from 'antd';
import roleService from '@src/services/roleService';
import { confirmDialog } from '@src/helpers/dialogs'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled, DeleteFilled } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";
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

const Edit = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [role, setRole]: any[] = useState();
  const [form] = Form.useForm();
  const { checkPermission } = usePermissionHook();
  const { query } = router

  const deletePer = checkPermission({
    "roles": "D"
  })

  const fetchData = async () => {
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: 'missing ID'
      }
    }
    if (idError) return notify(t(`errors:${idError.code}`), '', 'error')
    let [roleError, role]: [any, Role] = await to(roleService().withAuth().detail({ id: query.id }));
    if (roleError) return notify(t(`errors:${roleError.code}`), '', 'error')

    setRole(role)
  }

  useEffect(() => {
    fetchData()
  }, []);

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    let [error, result]: any[] = await to(roleService().withAuth().edit({
      id: role.id,
      ...values
    }));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordRoleUpdated"))
    redirect("frontend.admin.roles.index")

    return result
  }

  const onDelete = async (): Promise<void> => {
    let [error, result]: any[] = await to(roleService().withAuth().destroy({ id: role.id }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t('messages:message.recordRoleDeleted'))
    redirect("frontend.admin.roles.index")

    return result
  }

  if (!role) return <div className="content"><Spin /></div>

  return (
    <div className="content">
      <Form
        {...formItemLayout}
        form={form}
        name="editRole"
        initialValues={{
          name: role.name,
          description: role.description,
          parentId: role.parentId
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <RoleForm />
        <Form.Item wrapperCol={{ span: 24 }} className="text-center">
          <Button onClick={() => router.back()} className="btn-margin-right">
            <LeftCircleFilled /> {t('buttons:back')}
          </Button>
          <Button type="primary" htmlType="submit" className="btn-margin-right" loading={loading}>
            <SaveFilled /> {t('buttons:submit')}
          </Button>
          <Button hidden={!deletePer} danger
            onClick={() => {
              confirmDialog({
                title: t('buttons:deleteItem'),
                content: t('messages:message.deleteConfirm'),
                onOk: () => onDelete()
              })
            }}
          >
            <DeleteFilled /> {t('buttons:deleteItem')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

Edit.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:roles.edit.title")}
    description={t("pages:roles.edit.description")}
    {...props}
  />
}

Edit.permissions = {
  "roles": "U"
}

export default Edit