import React, {useEffect,useState} from "react";
import { Modal, Form } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import UserForm from '@src/components/Admin/Users/UserForm';
import userService from '@root/src/services/userService';
import to from 'await-to-js'

interface ModelFormProps {
  onUpdateUser: any;
  onCancel: () => void;
  visible: boolean;
}

const InfoUser = ({ onUpdateUser, visible, onCancel }: ModelFormProps) => {
  const { t,notify } = useBaseHook();
  const [form] = Form.useForm();
  const [admin, setAdmin]: any[] = useState<User>();

  const fetchData = async() => {
    let [adminError, User]: [any, User] = await to(userService().withAuth().getInfo());
    if(adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
    setAdmin(User)
  }

  useEffect(() => {
    fetchData()
  },[visible])

  if(!admin) return <></>

  return (
    <Form
      form={form}
      name="formUpdateUser"
      initialValues={{
        ...admin,
      }}
      layout="vertical"
      onFinish={onUpdateUser}
    >
      <Modal
        closable={false}
        open={visible}
        title={t("pages:infoUser.title")}
        onCancel={onCancel}
        onOk={() => { form.submit() }}
      >
        <UserForm form={form} isEdit={true} isTenant={true} />
      </Modal>
    </Form>
  );
};

export default InfoUser;
