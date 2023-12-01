import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd24 } from "@dhis2/ui";
import { isEmpty } from "lodash";
import React from "react";
import CustomTable from "../../../../shared/components/CustomTable";
import { Column } from "../../../../shared/interfaces";
import EmptyPushAnalyticsList from "../EmptyPushAnalyticsList";
import FullPageLoader from "../../../../shared/components/Loaders";
import { usePushAnalyticsConfig } from "./hooks/data";
import { PushAnalyticsModalConfig } from "../PushAnalyticsModalConfig";
import { useBoolean } from "usehooks-ts";

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
		label: i18n.t("Recipients"),
		key: "contacts",
	},
	{
		label: i18n.t("Actions"),
		key: "actions",
	},
];

export default function PushAnalyticsTable(): React.ReactElement {
	const { data, loading } = usePushAnalyticsConfig();
	const { value: hidden, setTrue: hide, setFalse: open } = useBoolean(true);

	if (loading) {
		return <FullPageLoader />;
	}

	return (
		<>
			{isEmpty(data) ? (
				<EmptyPushAnalyticsList />
			) : (
				<div className="column gap-16" style={{ width: "100%" }}>
					<div>
						{!hidden && (
							<PushAnalyticsModalConfig
								hidden={hidden}
								onClose={hide}
							/>
						)}
						<Button onClick={open} primary icon={<IconAdd24 />}>
							{i18n.t("Add push analytics configuration")}
						</Button>
					</div>
					<CustomTable
						loading={loading}
						columns={tableColumns}
						data={data}
						pagination={undefined}
					/>
				</div>
			)}
		</>
	);
}
