import React, {useMemo} from "react";
import i18n from "@dhis2/d2-i18n";
import {Column} from "../../../../../../shared/interfaces";
import CustomTable from "../../../../../../shared/components/CustomTable";
import {useSavedObject} from "@dhis2/app-service-datastore";
import {GatewayConfig} from "../GatewayConfigurationModal";

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
        label: "",
        key: "actions",
    },
];

export default function GatewayConfigurationsTable(): React.ReactElement {
    const [value] = useSavedObject(`gateways`)

    const rows = useMemo(() => {
        return (value as GatewayConfig[]).map((value: GatewayConfig) => {
            return {
                name: value.name,
                url: value.url,
            }
        })
    }, [value]);

    return (
        <div style={{width: "100%"}}>
            <CustomTable
                columns={tableColumns}
                data={rows}
                pagination={undefined}
                emptyTableMessage={i18n.t(
                    "There are no gateway configurations, click the above button to add new configurations."
                )}
            />
        </div>
    );
}
