import React from "react";
import i18n from "@dhis2/d2-i18n";
import { Column } from "../../../../../../shared/interfaces";
import CustomTable from "../../../../../../shared/components/CustomTable";

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
    label: i18n.t("Url"),
    key: "url",
  },
  {
    label: i18n.t("Created"),
    key: "created",
  },
  {
    label: "",
    key: "actions",
  },
];

export default function GatewayConfigurationsTable(): React.ReactElement {
  return (
    <div style={{ width: "100%" }}>
      <CustomTable
        columns={tableColumns}
        data={[]}
        pagination={undefined}
        emptyTableMessage={i18n.t(
          "There are no gateway configurations, click the above button to add new configurations."
        )}
      />
    </div>
  );
}
