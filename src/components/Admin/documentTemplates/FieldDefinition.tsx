import React, { useState } from "react";
import { Form, Col, Row, Input, Card, Select, InputNumber, Tag } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const dataTypes = ["number", "string", "datetime", "file"]
const inputTypes = ["numberInput", "textInput", "dateTimeInput", "selectInput", "fileInput"]
const listSourceTypes = ["database", "manual"]
const tables = ["users", "roles", "companies"]
const validations = [{ value: "required" }, { value: "whitespace" }, { value: "max" }]

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};


const FieldDefinition = ({ name, restField = undefined }) => {
  const [isNeedList, setIsNeedList] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<"database" | "manual">("database");
  const { t } = useBaseHook()

  return <Card
    title={t("pages:documentTemplates.create.fieldInformation.title")}
    style={{ width: "100%", marginBottom: "50px" }}
  >
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "fieldName"]}
          label={t("pages:documentTemplates.create.fieldInformation.fieldName")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.fieldName") }) },
            { whitespace: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.fieldName") }) },
            { max: 255, message: t('messages:form.maxLength', { name: t("pages:documentTemplates.create.fieldInformation.fieldName"), length: 255 }) }
          ]}
        >
          <Input placeholder={t("pages:documentTemplates.create.fieldInformation.fieldName")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "lable"]}
          label={t("pages:documentTemplates.create.fieldInformation.lable")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.lable") }) },
            { whitespace: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.lable") }) },
            { max: 255, message: t('messages:form.maxLength', { name: t("pages:documentTemplates.create.fieldInformation.lable"), length: 255 }) }
          ]}
        >
          <Input placeholder={t("pages:documentTemplates.create.fieldInformation.lable")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "dataType"]}
          label={t("pages:documentTemplates.create.fieldInformation.dataType")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.dataType") }) },
          ]}
        >
          <Select placeholder={t("pages:documentTemplates.create.fieldInformation.dataType")} style={{ width: "100%" }}>
            {dataTypes.map(dataType => <Select.Option key={dataType} value={dataType}>{dataType}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "inputType"]}
          label={t("pages:documentTemplates.create.fieldInformation.inputType")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.inputType") }) },
          ]}
        >
          <Select
            placeholder={t("pages:documentTemplates.create.fieldInformation.inputType")}
            style={{ width: "100%" }}
            onChange={(value) => {
              if (value == 'selectInput') setIsNeedList(true)
              else setIsNeedList(false)
            }} >
            {inputTypes.map(inputType => <Select.Option key={inputType} value={inputType}>{inputType}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>
      {
        isNeedList ?
          <>
            <Col span={12}>
              <Form.Item
                labelAlign={"left"}
                labelCol={{ xs: 6 }}
                {...restField}
                name={[name, "list", "sourceType"]}
                label={t("pages:documentTemplates.create.fieldInformation.sourceType")}
                rules={[
                  { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.sourceType") }) },
                ]}
              >
                <Select placeholder={t("pages:documentTemplates.create.fieldInformation.sourceType")} onChange={(value) => { setSourceType(value) }} >
                  {listSourceTypes.map(listSourceType => <Select.Option key={listSourceType} value={listSourceType}>{listSourceType}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                labelAlign={"left"}
                labelCol={{ xs: 6 }}
                {...restField}
                name={[name, "list", "source"]}
                label={t("pages:documentTemplates.create.fieldInformation.source")}
                rules={[
                  { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.source") }) },
                ]}
              >
                {
                  sourceType == 'database' ? <Select >
                    {tables.map(table => <Select.Option key={table} value={table}>{table}</Select.Option>)}

                  </Select> : <Input placeholder={t("pages:documentTemplates.create.fieldInformation.source")} />
                }


              </Form.Item>
            </Col>
          </>
          : <></>
      }

<Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "position"]}
          label={t("pages:documentTemplates.create.fieldInformation.position")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.position") }) },
          ]}
        >
          <InputNumber placeholder={t("pages:documentTemplates.create.fieldInformation.position")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "groupTitle"]}
          label={t("pages:documentTemplates.create.fieldInformation.groupTitle")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.groupTitle") }) },
          ]}
        >
          <Input placeholder={t("pages:documentTemplates.create.fieldInformation.groupTitle")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 12 }}
          {...restField}
          name={[name, "col-xs"]}
          label={t("pages:documentTemplates.create.fieldInformation.col-xs")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.col-xs") }) },
          ]}
        >
          <InputNumber placeholder={t("pages:documentTemplates.create.fieldInformation.col-xs")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          labelCol={{ xs: 12 }}
          {...restField}
          name={[name, "col-sm"]}
          label={t("pages:documentTemplates.create.fieldInformation.col-sm")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.col-sm") }) },
          ]}
        >
          <InputNumber placeholder={t("pages:documentTemplates.create.fieldInformation.col-sm")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          labelAlign="left"
          labelCol={{ xs: 12 }}
          {...restField}
          name={[name, "col-lg"]}
          label={t("pages:documentTemplates.create.fieldInformation.col-lg")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.col-lg") }) },
          ]}
        >
          <InputNumber placeholder={t("pages:documentTemplates.create.fieldInformation.col-lg")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          labelCol={{ xs: 12 }}
          {...restField}
          name={[name, "col-md"]}
          label={t("pages:documentTemplates.create.fieldInformation.col-md")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.col-md") }) },
          ]}
        >
          <InputNumber placeholder={t("pages:documentTemplates.create.fieldInformation.col-md")} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          labelAlign={"left"}
          labelCol={{ xs: 6 }}
          {...restField}
          name={[name, "validations"]}
          label={t("pages:documentTemplates.create.fieldInformation.validations")}
          rules={[
            { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.validations") }) },
          ]}
        >
          <Select
            placeholder={t("pages:documentTemplates.create.fieldInformation.validations")}
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={[]}
            style={{ width: '100%' }}
            options={validations}
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
}

export default FieldDefinition