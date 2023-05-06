import React from "react";
import i18n from "@dhis2/d2-i18n";
import CustomTable from "../../../../shared/components/CustomTable";
import { Column } from "../../../../shared/interfaces";

const tableColumns: Column[] = [
  {
    label: i18n.t("S/N"),
    key: "index",
  },
  {
    label: i18n.t("Name"),
    key: "name",
  },
  {
    label: i18n.t("Gateway"),
    key: "gateway",
  },
  {
    label: i18n.t("Recipients"),
    key: "contacts",
  },
  {
    label: "",
    key: "actions",
  },
];

export default function PushAnalyticsTable(): React.ReactElement {
  return (
    <div style={{ width: "100%" }}>
      <CustomTable columns={tableColumns} data={[]} pagination={undefined} />
    </div>
  );
}
