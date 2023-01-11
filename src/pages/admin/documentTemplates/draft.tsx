import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GridTable } from '@src/components/Table';
import { confirmDialog } from '@src/helpers/dialogs'
import FilterDatePicker from '@src/components/Table/SearchComponents/DatePicker'
import { Button } from 'antd';
import roleService from '@src/services/roleService';
import to from 'await-to-js'
import moment from 'moment'
import useBaseHook from '@src/hooks/BaseHook'
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })
function Draft() {
  return (
    <div>draft</div>
  )
}
Draft.Layout = (props) => {
    const { t } = useBaseHook();
  
    return <Layout
      title={t("pages:roles.index.title")}
      description={t("pages:roles.index.description")}
      {...props}
    />
  }
  
  Draft.permissions = {
    "roles": "R"
  };
  
export default Draft