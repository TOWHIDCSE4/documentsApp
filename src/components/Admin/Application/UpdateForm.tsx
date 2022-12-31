import React, { useState } from "react";
import { CommonForm } from "./CommonForm";
import schemaData from "../../../../config/Application_schema.json";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentsService from "@root/src/services/documentService";
import _ from "lodash";

const DynamicFormPage = ({ documentData }) => {
	const { t, notify, redirect, router } = useBaseHook();
  const { query } = router;
	const [formJsonSchema, setFormJsonSchema] = useState(schemaData);
	const [loading, setLoading] = useState(false);

	const onFinish = async (data: any): Promise<void> => {
		setLoading(true);
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: "missing ID",
      };
    }

    if (idError) return notify(t(`errors:${idError.code}`), "", "error");

		const documentReqBody = {
      id: query.id,
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
			documentsService().edit(documentReqBody)
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");

		setLoading(false);
		notify(t("messages:message.staffInsuranceFormUpdateSuccess"));
		redirect("frontend.admin.application.index");

		return result;
	};

	const onFinishFailed = (errorInfo: any): void => {
		console.log("Failed:", errorInfo);
	};

	if (!documentData) return <></>;

	return (
		<div className="content-documents">
			<Form
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				initialValues={documentData}
			>
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
														order={
															fieldValue.position
														}
													>
														<CommonForm
															formField={
																fieldValue
															}
														/>
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

				<div style={{ paddingTop: 10, paddingBottom: 10 }}>
					<fieldset className="fieldset">
						<TabComment />
					</fieldset>
				</div>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
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
