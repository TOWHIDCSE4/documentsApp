import dynamic from "next/dynamic";
import useBaseHook from "@src/hooks/BaseHook";
import React, { useEffect, useState } from "react";
import schemaData from "../../../../config/Application_schema.json";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";
import documentsService from "@root/src/services/documentService";
import _ from "lodash";
import { CommonForm } from "@root/src/components/Admin/Application/CommonForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const DocumentPDF = () => {
    const { t, notify, redirect, router } = useBaseHook();
    const [formJsonSchema, setFormJsonSchema] = useState(schemaData);
    const [loading, setLoading] = useState(false);
    let buttonId = 6;
	const { query } = router;
	const [documentData, setDocumentData]: any[] = useState();

    const onFinish = async (data: any): Promise<void> => {
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
            status: buttonId,
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

    const onFinishFailed = (errorInfo: any): void => {
        console.log("Failed:", errorInfo);
    };

    const exportPdf = async () => {
        const hide = document.querySelectorAll(".ToHide");
        const width = document.getElementById("content").offsetWidth;
        const height = document.getElementById("content").offsetHeight;
        hide.forEach((element) => {
            element.style.visibility = "hidden";
        });
        await html2canvas(document.querySelector(".App"), { useCORS: true, dpi: 300, scale: 3 }).then((canvas) => {
            const contentDataURL = canvas.toDataURL('image/jpeg', 1)
            let pdf = new jsPDF('l', 'px', [width, height]);
            let pdfWidth = pdf.internal.pageSize.getWidth()
            let pdfHeight = pdf.internal.pageSize.getHeight()
            pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            // window.open(pdf.output('bloburl', { filename: 'new-file.pdf' }), '_blank')
            pdf.save("application.pdf");
        });

    };

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
		setDocumentData(document.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

    if (!documentData) return <></>;
    return (
        <>

            <div className="content App" id="content">

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
                </div>
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