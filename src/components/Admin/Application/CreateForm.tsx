import React, { useState } from "react";
import { CommonForm } from "./CommonForm";
import schemaData from "../../../../config/Application_schema.json";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";
import documentsService from "@root/src/services/documentService";
import _ from "lodash";
import clsx from 'clsx';

const DynamicFormPage = () => {
	const { t, notify, redirect, router } = useBaseHook();
	const [formJsonSchema, setFormJsonSchema] = useState(schemaData);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	let buttonId = 6;

	const onFinish = async (data: any): Promise<void> => {
		setLoading(true);
		const templateReqBody = {
			name: "Staff Insurance FormStaff Insurance 2022",
			description: null,
			content: JSON.stringify(schemaData),
			locale: null,
			createdBy: 1,
			updatedBy: null,
		};

		const documentReqBody = {
			name: "Staff Insurance FormStaff Insurance 2022",
			content: JSON.stringify(data),
			status: buttonId,
			documentTemplateId: null,
			createdBy: 1,
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

	const onFinishFailed = (errorInfo: any): void => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="content-documents">
			<Form
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				layout="vertical"
				form={form}
			>
				{Object.entries(_.groupBy(formJsonSchema, "groupTitle")).map(
					(item, i) => {
						return (
							<>
								<div className="form-group">
									<h2>{item[0]}</h2>
									<Row className="form-container">
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
														className={clsx({
															'row-span-2' : fieldValue.inputType === 'fileInput',
															'col-span-full': fieldValue.fieldName === 'street' || fieldValue.fieldName === 'officeStreet',
															
														})}
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
					<Button type="primary" onClick={() => router.back()}>
						{t("buttons:back")}
					</Button>

					<Button
						type="primary"
						style={{ marginLeft: 10 }}
						htmlType="submit"
					>
						Submit
					</Button>

					<Button
						onClick={() => (buttonId = 7)}
						style={{ marginLeft: 10 }}
						type="primary"
						htmlType="submit"
					>
						Draft
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