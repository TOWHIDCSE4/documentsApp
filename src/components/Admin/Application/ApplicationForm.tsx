import { AlignCenterOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useBaseHooks from "@root/src/hooks/BaseHook";
import {
	Button,
	Card,
	Col,
	Row,
	Space,
	Statistic,
	Input,
	Table,
	PaginationProps,
	Pagination,
} from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useEffect, useState } from "react";
import useStatusCount from "@root/src/hooks/StatusCount";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";

const { Search } = Input;

const ApplicationForm = () => {
	const { t, redirect, notify } = useBaseHooks();
	const status = useStatusCount();
	const [documentTemplateFrom, setDocumentTemplateFrom] = useState(null);
	const [loading, setLoading] = useState(false);

	const onSearch = async (value: string) => {
		setLoading(true);
		setDocumentTemplateFrom(null);

		const values: any = {};
		values.sorting = [
			{ field: "document_templates.id", direction: "desc" },
		];

		values.filter = [
			{
				field: "document_templates.name",
				operator: "like",
				value: `%${value}%`,
			},
			{
				field: "document_templates.description",
				operator: "like",
				value: `%${value}%`,
			},
		];	

		values.pageSize = 4;

		let [error, documentTemplateFromObject]: [any, any] = await to(
			documentTemplateService().withAuth().index(values)
		);
		console.log(
			"🚀 ~ file: ApplicationForm.tsx:32 ~ onSearch ~ documentTemplateFromObject",
			documentTemplateFromObject
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");
		setDocumentTemplateFrom(documentTemplateFromObject?.data);
	};

	const fetchData = async () => {
		const values: any = {};
		values.sorting = [
			{ field: "document_templates.id", direction: "desc" },
		];
		values.pageSize = 4;

		let [error, documentTemplateFromObject]: [any, any] = await to(
			documentTemplateService().withAuth().index(values)
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");
		setDocumentTemplateFrom(documentTemplateFromObject?.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Row gutter={16}>
				<Col span={12}>
					<Card
						type="inner"
						title="Form List"
						onClick={() =>
							redirect("frontend.admin.documentTemplate")
						}
						extra={
							<a>{t("pages:application.applicationForm.view")}</a>
						}
					>
						<Row>
							<Col span={6}>
								<Statistic
									title={t(
										"pages:application.applicationForm.submitted"
									)}
									value={status.total}
								/>
							</Col>
							<Col span={6}>
								<Statistic
									title={t(
										"pages:application.applicationForm.approve"
									)}
									value={status["Approve"]}
								/>
							</Col>
							<Col span={6}>
								<Statistic
									title={t(
										"pages:application.applicationForm.inReview"
									)}
									value={status["To Be Reviewed"]}
								/>
							</Col>
							<Col span={6}>
								<Statistic
									title={t(
										"pages:application.applicationForm.rejected"
									)}
									value={status["Rejected"]}
								/>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={12}>
					<Card
						type="inner"
						title="Form Draft"
						onClick={() =>
							redirect("frontend.admin.documentTemplate.draft")
						}
						extra={
							<a>{t("pages:application.applicationForm.view")}</a>
						}
					>
						<Statistic
							title={t("pages:application.applicationForm.draft")}
							value={status["null"]}
						/>
					</Card>
				</Col>
			</Row>
			<br />
			<Card type="inner">
				<Space>
					<Button>
						<AlignCenterOutlined /> More Filter
					</Button>
				</Space>
				<Search
					placeholder="Search"
					className="btn-right"
					onSearch={onSearch}
					style={{ width: 300 }}
				/>
			</Card>
			<Card>
				<Row justify="space-between">
					{documentTemplateFrom?.map((documentTemplate: any) => {
						return (
							<Card
								hoverable
								style={{ width: 240 }}
								cover={
									<img
										alt="anh-nen"
										src="https://img.freepik.com/free-vector/vibrant-summer-ombre-background-vector_53876-105765.jpg?w=2000"
									/>
								}
							>
								<Meta
									title={documentTemplate?.name}
									description={documentTemplate?.description}
								/>
								<br />
								<Button
									type="primary"
									onClick={() =>
										redirect(
											"frontend.admin.application.create"
										)
									}
								>
									{t(
										"pages:application.applicationForm.apply"
									)}{" "}
									<ArrowRightOutlined />
								</Button>
							</Card>
						);
					})}
				</Row>
			</Card>
			<br />
			<div className="text-center">
				<Pagination
					total={85}
					defaultPageSize={20}
					defaultCurrent={1}
				/>
			</div>
		</>
	);
};

export default ApplicationForm;
