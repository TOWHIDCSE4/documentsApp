import dynamic from 'next/dynamic'
import { FilePdfOutlined, FileOutlined } from '@ant-design/icons';
import {
    Typography,
    Button,
    Space, Input,
    Badge,
} from "antd";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
// import autoTable from 'jspdf-autotable'
const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })
import useBaseHook from '@src/hooks/BaseHook';
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import documentTemplateService from "@root/src/services/documentTemplateService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import React, { useState, useRef } from "react";

interface jsPDFWithPlugin extends jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
}

function checkStatus(status: string) {
    let colorObj = { padding: '4px 8px', borderRadius: '5px', color: '#b22222', backgroundColor: '#fff6f6', width: '75px' };
    if (status === 'Approve') {
        colorObj = {
            ...colorObj,
            color: '#17B169',
            backgroundColor: '#cefad0',
            width: '70px'
        }
    } else if (status === 'To Be Reviewed') {
        colorObj = {
            ...colorObj,
            color: '#DAA520',
            backgroundColor: '#FFF8DC',
            width: '120px'
        }
    } else if (status == 'Rejected') {
        colorObj = {
            ...colorObj,
            color: '#b22222',
            backgroundColor: '#fff6f6',
            width: '75px'
        }
    }

    return colorObj;
}

const Index = () => {
    const { redirect, t, notify } = useBaseHook();
    const { Title } = Typography;
    const { Search } = Input;
    const ButtonGroup = Button.Group;
    const tableRef = useRef(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [document_templates, setdocument_templates] = useState(null);
    const [statusCount, setStatusCount] = useState(null);
    const [hiddenDeleteBtn, setHiddenDeleteBtn] = useState(true);

    const onSearch = (value: string) => console.log(value);

    const fetchData = async (values: any) => {
        if (!values.sorting.length) {
            values.sorting = [{ field: "document_templates.id", direction: "desc" }];
        }
        let [error, document_templates]: [any, any] = await to(
            documentTemplateService().withAuth().index(values)
        );
        if (error) {
            const { code, message } = error;
            notify(t(`errors:${code}`), t(message), "error");
            return {};
        }

        if (document_templates) {
            const resultObj = JSON.parse(JSON.stringify(document_templates));
            console.log("document_templates are ", document_templates);
            let result = _.countBy(resultObj.data, 'status');
            console.log("result is ", result);
            setStatusCount(result);
            setdocument_templates(resultObj);
        }

        return document_templates;
    };

    const onChangeSelection = (data: any) => {
        if (data.length > 0) setHiddenDeleteBtn(false);
        else setHiddenDeleteBtn(true);
        setSelectedIds(data);
    };

    const rowSelection = {
        getCheckboxProps: (record) => ({
            disabled: record.id == auth().user.id,
            id: record.id,
        }),
    };

    const generatePdf = (rowInfo: any) => {
        const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
        const tableTitle = ["Form Name", "Form ID", "Issued By", "Issued Date", "Submitter", "Submit Date", "Status", "Updated Date"];
        const tableRow = [
            rowInfo.name,
            rowInfo.formId,
            rowInfo.issuedBy,
            moment(rowInfo.issuedDate).format('LL'),
            rowInfo.submitter,
            moment(rowInfo.submitDate).format('LL'),
            rowInfo.status,
            moment(rowInfo.updatedDate).format('LL')
        ];
        doc.autoTable({
            head: [tableTitle],
            body: [tableRow]
        });

        doc.save(rowInfo.formId);
    }

    const columns = [
        {
            title: t("pages:documentsTemplate.table.name"),
            dataIndex: "name",
            key: "document_templates.name",
            sorter: true,
            filterable: true,
            render: (text, record) => {
                return <strong>{text}</strong>;
            }
        },
        {
            title: t("pages:documentsTemplate.table.formId"),
            dataIndex: "formId",
            key: "document_templates.formId",
            sorter: true,
            filterable: true,
        },
        {
            title: t("pages:documentsTemplate.table.issuedBy"),
            dataIndex: "issuedBy",
            key: "document_templates.issuedBy",
            sorter: true,
            filterable: true,
        },
        {
            title: t("pages:documentsTemplate.table.issuedDate"),
            dataIndex: "issuedDate",
            key: "document_templates.issuedDate",
            sorter: true,
            filterable: true,
            render: (text: string, record: any) =>
                text ? moment(text).format('LL') : "",
            renderFilter: ({ column, confirm, ref }: FilterParam) => (
                <FilterDatePicker column={column} confirm={confirm} ref={ref} />
            ),
        },
        {
            title: t("pages:documentsTemplate.table.submitter"),
            dataIndex: "submitter",
            key: "document_templates.submitter",
            sorter: true,
            filterable: true,
        },
        {
            title: t("pages:documentsTemplate.table.submitDate"),
            dataIndex: "submitDate",
            key: "document_templates.submitDate",
            sorter: true,
            filterable: true,
            render: (text: string, record: any) =>
                text ? moment(text).format('LL') : "",
            renderFilter: ({ column, confirm, ref }: FilterParam) => (
                <FilterDatePicker column={column} confirm={confirm} ref={ref} />
            ),
        },
        {
            title: t("pages:documentsTemplate.table.status"),
            dataIndex: "status",
            key: "document_templates.status",
            sorter: true,
            filterable: true,
            render: (text, record) => {
                return (
                    <div style={checkStatus(text)}>
                        {text}
                    </div>
                )
            }
        },
        {
            title: t("pages:documentsTemplate.table.updatedAt"),
            dataIndex: "updatedAt",
            key: "document_templates.updatedAt",
            sorter: true,
            filterable: true,
            render: (text: string, record: any) =>
                text ? moment(text).format('LL') : "",
            renderFilter: ({ column, confirm, ref }: FilterParam) => (
                <FilterDatePicker column={column} confirm={confirm} ref={ref} />
            ),
        },
        {
            title: t("pages:documentsTemplate.table.action"),
            key: 'action',
            render: (text, record) => {
                return (
                    <Space size="middle" >
                        <span onClick={() => generatePdf(record)} title='Download PDF' style={{ cursor: "pointer" }}><FilePdfOutlined style={{ fontSize: "21px" }} /></span>
                        <span title='Download CSV' style={{ cursor: "pointer" }}><FileOutlined style={{ fontSize: "20px" }} /></span>
                    </Space>
                )
            }
        }
    ];

    return <>
        <div className="content">
            <div style={{ float: "right", marginBottom: '10px' }}>
                {
                    statusCount && (
                        <div>
                            <ButtonGroup>
                                <Button onClick={() => console.log("All button is clicked")}>
                                    <Badge count={statusCount['Approve']} style={{ color: '#17B169', backgroundColor: '#cefad0' }} />
                                    <span style={{ marginLeft: 5 }}> Approve</span>
                                </Button>
                                <Button onClick={() => console.log("To Be Reviewed button is clicked")}>
                                    <Badge count={statusCount['To Be Reviewed']} style={{ color: '#DAA520', backgroundColor: '#FFF8DC' }} />
                                    <span style={{ marginLeft: 5 }}> To Be Reviewed</span>
                                </Button>
                                <Button onClick={() => console.log("Rejected button is clicked")}>
                                    <Badge count={statusCount['Rejected']} style={{ color: '#b22222', backgroundColor: '#fff6f6', }} />
                                    <span style={{ marginLeft: 5 }}> Rejected</span>
                                </Button>
                            </ButtonGroup>
                        </div>
                    )
                }
            </div>

            <GridTable
                ref={tableRef}
                columns={columns}
                fetchData={fetchData}
                rowSelection={{
                    selectedRowKeys: selectedIds,
                    onChange: (data: any[]) => onChangeSelection(data),
                    ...rowSelection,
                }}
                addIndexCol={false}
                selectableRowsHighlight
            />
        </div>
    </>
}


Index.Layout = (props) => {
    const { t } = useBaseHook();
    return <>
        <Layout
            title={t('pages:documentsTemplate.index.title')}
            description={t('pages:documentsTemplate.index.description')}
            {...props}
        />
    </>
}

Index.permissions = {
    document_templates: "R",
};

export default Index