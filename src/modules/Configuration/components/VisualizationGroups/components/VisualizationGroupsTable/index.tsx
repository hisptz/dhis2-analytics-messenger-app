import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Column,} from "../../../../../../shared/interfaces";
import {useVisualizationGroups} from "../../hooks";
import {CustomDataTable} from "@hisptz/dhis2-ui";

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
        label: i18n.t("Actions"),
        key: "action",
    },
];

export default function VisualizationGroupsTable(): React.ReactElement {
    const {visualizationGroups, loading, error, refetch, pager} =
        useVisualizationGroups();

    return (
        <div style={{width: "100%"}}>
            <CustomDataTable
                columns={tableColumns}
                loading={loading}
                rows={visualizationGroups as any}
                pagination={undefined}

            />
        </div>
    );
}
