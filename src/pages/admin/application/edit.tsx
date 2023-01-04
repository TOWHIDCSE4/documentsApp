import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import { Row, Col } from "antd";
import to from "await-to-js";
import UpdateForm from "@root/src/components/Admin/Application/UpdateForm";
import documentsService from "@root/src/services/documentService";
import dayjs from 'dayjs';

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Edit = () => {
	const { t, notify, redirect, router } = useBaseHook();
	const { query } = router;
	const [documentData, setDocumentData] = useState(null);

	const fetchData = async () => {
		let idError: any = null;

		if (!query.id) {
			idError = {
				code: 9996,
				message: "missing ID",
			};
		}

		if (idError) return notify(t(`errors:${idError.code}`), "", "error");

		let [error, document]: [any, any] = await to(
			documentsService().withAuth().detail({ id: query.id })
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");
		const documentDataObject = document?.["data"];
		documentDataObject.birthday = dayjs(documentDataObject?.["birthday"]);
		setDocumentData(documentDataObject);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<div className="content">
				<UpdateForm documentData={documentData} />
			</div>
		</>
	);
};

Edit.Layout = (props) => {
	const { t } = useBaseHook();

	return (
		<Layout
			title={t("pages:application.staffInsuranceForm.title")}
			description={t("pages:application.staffInsuranceForm.description")}
			{...props}
		/>
	);
};

export default Edit;