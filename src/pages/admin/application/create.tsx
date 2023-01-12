import dynamic from "next/dynamic";
import React from "react";
import useBaseHook from "@src/hooks/BaseHook";
import { Row, Col } from "antd";
import CreateForm from "@root/src/components/Admin/Application/CreateForm";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Create = () => {
  return (
    <>
      <div className="content">
        <CreateForm />
      </div>
    </>
  );
};

Create.Layout = (props) => {
  const { t } = useBaseHook();

  return (
    <Layout
      title={t("pages:application.staffInsuranceForm.title")}
      description={t("pages:application.staffInsuranceForm.description")}
      {...props}
    />
  );
};

Create.permissions = {
  "application": "C"
}

export default Create;
