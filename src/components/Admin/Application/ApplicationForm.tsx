import { AlignCenterOutlined, ArrowRightOutlined } from '@ant-design/icons';
import useBaseHooks from '@root/src/hooks/BaseHook';
import { Button, Card, Col, Row, Space, Statistic, Input, Table, PaginationProps, Pagination } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
import useStatusCount from '@root/src/hooks/StatusCount';

const { Search } = Input;

const onSearch = (value: string) => console.log(value);


const ApplicationForm = () => {
    const {t, redirect, notify} = useBaseHooks();
    const status = useStatusCount();
    
    return <>
        <Row gutter={16}>
            <Col span={12}>
                <Card type="inner" title="Form List" onClick={() => redirect("frontend.admin.documentTemplate")} extra={<a>{t('pages:application.applicationForm.view')}</a>}>
                    <Row>
                        <Col span={6}>
                            <Statistic title={t('pages:application.applicationForm.submitted')} value={status.total} />
                        </Col>
                        <Col span={6}>
                            <Statistic title={t('pages:application.applicationForm.approve')} value={status["Approve"]} />
                        </Col>
                        <Col span={6}>
                            <Statistic title={t('pages:application.applicationForm.inReview')} value={status["To Be Reviewed"]} />
                        </Col>
                        <Col span={6}>
                            <Statistic title={t('pages:application.applicationForm.rejected')} value={status["Rejected"]} />
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={12}>
                <Card type="inner" title="Form Draft" extra={<a>{t('pages:application.applicationForm.view')}</a>}>
                    <Statistic title={t('pages:application.applicationForm.draft')} value={status["null"]} />
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
            <Search placeholder="Search" className="btn-right" onSearch={onSearch} style={{ width: 300}} />
        </Card>
        <Card>
            <Row justify='space-between'>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="anh-nen" src="https://img.freepik.com/free-vector/vibrant-summer-ombre-background-vector_53876-105765.jpg?w=2000" />}
                >
                    <Meta title="Staff Insurance 2022" description="Staff Insurance 2022 is dedicated to tenants & worker." />
                    <br/>
                    <Button type="primary" onClick={() => redirect("frontend.admin.application.create")}>
                        {t('pages:application.applicationForm.apply')} <ArrowRightOutlined />
                    </Button>
                </Card>

                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="anh-nen" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU9R3q8guKFAt-fsNfc_7AN6a_o9tQxsAGXnbPDNbuvndQfusFQRHl3wCLAzGRIL0Pr_M&usqp=CAU" />}
                >
                    <Meta title="2022 Water Rebate" description="How do you create compelling presentations that wow." />
                    <br/>
                    <Button type="primary">
                        {t('pages:application.applicationForm.apply')} <ArrowRightOutlined />
                    </Button>
                </Card>

                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="anh-nen" src="https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2545.jpg?w=2000" />}
                >
                    <Meta title="2022 Electric Rebate" description="How do you create compelling presentations that wow." />
                    <br/>
                    <Button type="primary">
                        {t('pages:application.applicationForm.apply')} <ArrowRightOutlined />
                    </Button>
                </Card>

                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="anh-nen" src="https://img.freepik.com/free-vector/vibrant-summer-ombre-background-vector_53876-105765.jpg?w=2000" />}
                >
                    <Meta title="Staff Insurance 2022" description="Staff Insurance 2022 is dedicated to tenants & worker." />
                    <br/>
                    <Button type="primary" onClick={() => redirect("frontend.admin.application.create")}>
                        {t('pages:application.applicationForm.apply')} <ArrowRightOutlined />
                    </Button>
                </Card>
            </Row>
        </Card>
        <br/>
        <div className='text-center'>
            <Pagination
                total={85}
                defaultPageSize={20}
                defaultCurrent={1}
            />
        </div>
    </>
}

export default ApplicationForm