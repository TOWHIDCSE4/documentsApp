import dynamic from "next/dynamic";
import useBaseHook from "@src/hooks/BaseHook";
import React, { useEffect, useState } from "react";
import schemaData from "../../../../config/Application_schema.json";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";
import documentsService from "@root/src/services/documentService";
import PdfForm from "@root/src/components/Admin/Application/PdfForm";
import _ from "lodash";
import { CommonForm } from "@root/src/components/Admin/Application/CommonForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import clsx from "clsx";
import dayjs from 'dayjs';

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const DocumentPDF = () => {
    const { t, notify, redirect, router } = useBaseHook();
    const [formJsonSchema, setFormJsonSchema] = useState(schemaData);
    const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
    let buttonId = 6;
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
		const documentDataObject = document && {
			documentTemplateId:document.documentTemplateId,
			createdAt: document.createdAt,
			createdBy: document.createdBy,
			id: document.id,
			name: document.name,
			status: document.status,
			updatedAt: document.updatedAt,
			updatedBy: document.updatedBy,
			...document.content
		};
		console.log(documentDataObject);
		
		documentDataObject.birthday = dayjs(documentDataObject?.["birthday"]);
		setDocumentData(documentDataObject);
	};

    const exportPdf = async () => {
        const hide = document.querySelectorAll(".ToHide");
        const width = document.getElementById("content").offsetWidth;
        const height = document.getElementById("content").offsetHeight;
        const pdfcanvas = document.createElement('canvas');
        const pdfcontext = pdfcanvas.getContext('2d');
        hide.forEach((element) => {
            element.style.visibility = "hidden";
        });
        await html2canvas(document.querySelector(".App"), { useCORS: true, dpi: 300, scale: 3 }).then((canvas) => {
            const contentDataURL = canvas.toDataURL('image/jpeg', 1)
            let pdf = new jsPDF('p', 'mm', "a4");
            let pdfWidth = pdf.internal.pageSize.getWidth()
            let pdfHeight = pdf.internal.pageSize.getHeight()
            // pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            // // window.open(pdf.output('bloburl', { filename: 'new-file.pdf' }), '_blank')
            // pdf.save("application.pdf");
            pdfcanvas.width = canvas.width/2
            pdfcanvas.height = canvas.height/2
            pdfcontext.drawImage(canvas, 0,0, canvas.width/2, canvas.height/2)
            const frame = pdfcanvas.toDataURL('image/png')
            pdf.addImage(frame, 'JPEG',0,0,pdfWidth, pdfHeight);
            pdf.save("application.pdf");
        });

    };

	useEffect(() => {
		fetchData();
	}, []);

    if (!documentData) return <></>;
    return (
        <>

            <div className="content App" id="content">
            <PdfForm documentData={documentData} />

                {/* <div className="content-documents">
                    <Form
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={documentData}
				        form={form}
                        layout="vertical"
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
                        <div className="ToHide">

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    onClick={exportPdf}
                                    style={{ marginLeft: 10 }}
                                    type="primary"
                                >
                                    Export PDF
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div> */}
            </div>
        </>
    );
};

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

DocumentPDF.Layout = (props) => {
    const { t } = useBaseHook();

    return (
        <Layout
            title={t("pages:application.staffInsuranceForm.title")}
            description={t("pages:application.staffInsuranceForm.description")}
            {...props}
        />
    );
};

export default DocumentPDF;