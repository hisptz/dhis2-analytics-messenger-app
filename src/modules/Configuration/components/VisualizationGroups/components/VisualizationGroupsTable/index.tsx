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
    label: i18n.t("Group name"),
    key: "name",
  },
  {
    label: i18n.t("created"),
    key: "created",
  },
  {
    label: "",
    key: "actions",
  },
];

export default function VisualizationGroupsTable(): React.ReactElement {
  return (
    <div style={{ width: "100%" }}>
      <CustomTable
        columns={tableColumns}
        data={[]}
        pagination={undefined}
        emptyTableMessage={i18n.t(
          "There are no Visualization groups, click the above button to add a new group."
        )}
      />
    </div>
  );
}
