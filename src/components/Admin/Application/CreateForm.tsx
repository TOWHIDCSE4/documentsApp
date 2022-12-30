import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CommonForm } from "./CommonForm";
import schemaData from "../../../../config/Application_schema.json";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Row, Col, Tabs } from "antd";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";
import documentsService from "@root/src/services/documentService";
import _ from "lodash";

const DynamicFormPage = () => {
  const { t, notify, redirect } = useBaseHook();

  const [formJsonSchema, setFormJsonSchema] = useState(schemaData);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "all",
  });

  const { handleSubmit } = methods;

	const onSubmit = async (data: any) => {
		setLoading(true);
		const templateReqBody = {
			name: "Staff Insurance FormStaff Insurance 2022",
			description: null,
			content: JSON.stringify(schemaData),
			locale: null,
			createdBy: null,
			updatedBy: null,
		};

		const documentReqBody = {
			formId: null,
			formName: "Staff Insurance FormStaff Insurance 2022",
			data: JSON.stringify(data),
			issuedBy: null,
			issuedDate: null,
			submitter: null,
			company: null,
			tenant: null,
			status: null,
			createdBy: null,
			updatedBy: null,
		};

		let [error, result]: any[] = await to(
			documentTemplateService().create(templateReqBody),
			documentsService().create(documentReqBody)
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");

		setLoading(false);
		notify(t("messages:message.staffInsuranceFormSuccess"));
		redirect("frontend.admin.application.index");

		return result;
	};
  return (
    <div className="content-documents">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <>
            {Object.entries(_.groupBy(formJsonSchema, "groupTitle")).map(
              (item, i) => {
                return (
                  <>
                    <div className="form-group">
                      <h2>{item[0]}</h2>
                      <Row className="container-one-third">
                        {item[1].map((fieldValue, i) => {
                          return (
                            <>
                              <Col
                                key={i}
                                xs="field.Col.xs"
                                lg="field.Col.lg"
                                order={fieldValue.position}
                              >
                                <CommonForm formField={fieldValue} />
                              </Col>
                            </>
                          );
                        })}
                      </Row>
                    </div>
                  </>
                );
              }
            )}
          </>
          <div style={{ paddingTop: 10, paddingBottom: 10 }}>
            <fieldset className="fieldset">
              <TabComment />
            </fieldset>
          </div>
          <div className="">
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default DynamicFormPage;

const TabComment = (item) => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Issuer Comment`,
            key: "1",
            children: (
              <CommonForm
                formField={{
                  fieldName: "issueComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
              />
            ),
          },
          {
            label: `Tenant Admin Comment`,
            key: "2",
            children: (
              <CommonForm
                formField={{
                  fieldName: "adminComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
              />
            ),
          },
          {
            label: `Individual Comment`,
            key: "3",
            children: (
              <CommonForm
                formField={{
                  fieldName: "individualComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
