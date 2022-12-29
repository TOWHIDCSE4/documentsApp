import React from 'react'
import { Form, Input, Select } from 'antd';
import useBaseHook from '@src/hooks/BaseHook'
import roleGroup from '@root/src/services/roleService'
import useSWR from 'swr';

const { Option } = Select

const RoleGroupForm = () => {
  const { t, getData, router } = useBaseHook();
  const { query } = router
  const { data } = useSWR('selectParent', () => roleGroup().withAuth().select2({id:query.id,pageSize: -1}))
  const roles = getData(data, "data", [])

  return <>
    <Form.Item
      label={t("pages:roles.table.name")}
      name="name"
      rules={[
        { required: true, message: t('messages:form.required', { name: t('pages:roles.table.name') }) },
        { whitespace: true, message: t('messages:form.required', { name: t('pages:roles.table.name') }) },
        { max: 255, message: t('messages:form.maxLength', { name: t('pages:roles.table.name'), length: 255 }) }
      ]}
    >
      <Input placeholder={t("pages:roles.table.name")} />
    </Form.Item>
    <Form.Item
      label={t("pages:roles.table.description")}
      name="description"
      rules={[
        { max: 255, message: t('messages:form.maxLength', { name: t('pages:roles.table.description'), length: 255 }) }
      ]}
    >
      <Input placeholder={t("pages:roles.table.description")} />
    </Form.Item>
    <Form.Item
      label={t("pages:roles.form.parent")}
      name="parentId"
      rules={[
        { required: true, message: t('messages:form.required', {name: t('pages:roles.form.parent')}) },
      ]}
    >
      <Select placeholder={t("pages:roles.form.parent")} allowClear showSearch>
        {roles.map((item: any) => (
          <Option value={item.value} key={item.value}>{item.label}</Option>
        ))}
      </Select>
    </Form.Item>
  </>
}

export default RoleGroupForm
