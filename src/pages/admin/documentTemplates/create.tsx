import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Col, Row, Input, Space, Select } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import FieldDefinition from "@root/src/components/Admin/documentTemplates/FieldDefinition";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const languageTypes = ["EN", "VN"]

const Create = () => {

  const { t } = useBaseHook()
  const [form] = Form.useForm();
  let selectedRowKeys: string[] = [];
  let selectedActiveRowKeys: string[] = [];
  if (typeof window !== "undefined") {
    selectedRowKeys = localStorage.getItem("selectedRowKeys")
      ? localStorage.getItem("selectedRowKeys").split(",")
      : [];
    selectedActiveRowKeys = selectedRowKeys.splice(0, 5);
  }
  useEffect(() => {
    init();
  }, []);

  const init = async () => { };

  const submitForm = async () => {
    console.log(form.getFieldsValue())
  };

  return (
    <div className="content">
      <Form
        form={form}
        onFinish={async () => {
          await submitForm();
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["templatesName"]}
              label={t("pages:documentTemplates.create.fieldInformation.templatesName")}
              rules={[
                { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.templatesName") }) },
              ]}
            >
              <Input placeholder={t("pages:documentTemplates.create.fieldInformation.templatesName")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["language"]}
              label={t("pages:documentTemplates.create.fieldInformation.language")}
              rules={[
                { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.language") }) },
              ]}
            >
              <Select placeholder={t("pages:documentTemplates.create.fieldInformation.language")} style={{ width: "100%" }}>
                {languageTypes.map(languageTypes => <Select.Option key={languageTypes} value={languageTypes}>{languageTypes}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.List name="createDocumentTemplates" >
          {(fields, { add, remove }) => (
            <div>
              {fields.map((key, name, ...restField) => {
                return (
                  <div key={String(key)} >
                    <Form.Item className="btn-right">
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Form.Item> <br />
                    <FieldDefinition name={name} restField={restField} />
                  </div>
                );
              })}
              <Form.Item className="text-center">
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: "100%" }}
                >
                  Add field
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              className="custom-icon-button"
            >
              <SendOutlined style={{ marginBottom: "5px" }} /> Submit
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

Create.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documentTemplates.create.title")}
      description={t("pages:documentTemplates.create.description")}
      {...props}
    />
  );
};

Create.permissions = {
  documentTemplates: "C",
};

export default Create;
