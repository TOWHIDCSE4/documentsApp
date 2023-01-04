import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { LeftCircleFilled } from "@ant-design/icons";
import authService from "@src/services/authService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import auth from "@src/helpers/auth";
import { Button, Form, Input, Row, Col } from "antd";
import QRCode from "qrcode";
const speakeasy = require("speakeasy");
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Layout = dynamic(() => import("@src/layouts/Login"), { ssr: false });

const Twofa = () => {
  const { t, notify, redirect } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const canvasRef = useRef();

  let user = auth().user;

  useEffect(() => {
    if (user.twofaKey) {
      let dataImage = speakeasy.otpauthURL({
        secret: user.twofaKey,
        label: publicRuntimeConfig.LABEL2FA || "App_platform",
      });
      QRCode.toCanvas(
        canvasRef.current,
        dataImage || " ",
        (error) => error && console.error(error)
      );
    }
  }, [user.twofaKey]);

  const onFinish = async (values: { tokenVerify: string }) => {
    let value = {
      tokenVerify: String(values.tokenVerify),
      code: user.code,
    };
    console.log(value);
    setLoading(true);
    let [error, result]: any[] = await to(
      authService().withAuth().AuthTwofa(value)
    );
    setLoading(false);
    if (error)
      return notify(
        t("messages:message.loginFailed"),
        t(`errors:${error.code}`),
        "error"
      );
    auth().setAuth(result);
    notify(t("messages:message.loginSuccess"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  return (
    <div className="content-form">
      <div className="logo">
        <div className="img">
          {user && user.isFirst && user.twofaKey ? (
            <div>
                <div>
                <div className="title">
                  {t("pages:users.twofa.link.title")}
                </div>
                <div className="title">
                  {t("pages:users.twofa.link.link")}
                </div>
                <div className="title">
                  Android:{" "}
                  <a
                    href={t("pages:users.twofa.link.android")}
                    className="title"
                  >
                    Link here!
                  </a>
                </div>
                <div className="title">
                  Ios:{" "}
                  <a
                    href={t("pages:users.twofa.link.ios")}
                    className="title"
                  >
                    Link here!
                  </a>
                </div>
              </div>
              <div className="title">{t("pages:login.titleVerify")}</div>
              <canvas ref={canvasRef} />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="sitename">{t("pages:login.Verify")}</div>
      </div>
      <Form
        onFinish={onFinish}
        form={form}
        name="tokenVerifyForm"
        layout="horizontal"
        initialValues={{
          tokenVerify: "",
        }}
      >
        <Col md={24} sm={24} xs={24}>
          <Form.Item
            name="tokenVerify"
            rules={[
              {
                required: true,
                message: t("messages:form.required", {
                  name: t("pages:login.tokenVerify"),
                }),
              },
            ]}
          >
            <Input placeholder={t("pages:login.tokenVerify")} />
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24}>
          <Form.Item>
            <Row>
              <Col md={6} sm={6} xs={6}>
                <Button
                  onClick={() => {
                    auth().logout();
                    redirect("frontend.admin.login");
                  }}
                  className="btn-margin-right"
                >
                  <LeftCircleFilled /> {t("buttons:login")}
                </Button>
              </Col>
              <Col md={18} sm={18} xs={18}>
                <Button
                  className="btn login"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t("buttons:verify")}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Form>
    </div>
  );
};

Twofa.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:login.title")}
      description={t("pages:login.description")}
      {...props}
    />
  );
};

Twofa.permissions = {
  verifyTwofa: "R",
};

export default Twofa;
