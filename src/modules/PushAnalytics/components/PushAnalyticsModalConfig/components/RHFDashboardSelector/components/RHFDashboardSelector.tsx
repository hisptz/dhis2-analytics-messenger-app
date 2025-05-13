import { useDashboards } from "../../../hooks/dashboards";
import React, { useMemo } from "react";
import i18n from "@dhis2/d2-i18n";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";

export function DashboardSelector() {
	const { dashboards, error, loading } = useDashboards();
	const options = useMemo(
		() =>
			dashboards.map(({ id, name }) => ({
				label: name,
				value: id,
			})),
		[dashboards],
	);

	return (
		<RHFSingleSelectField
			loading={loading}
			helpText={
				error
					? `${i18n.t("Error getting dashboards")}: ${error.message}`
					: undefined
			}
			name="dashboard"
			options={options}
			label={i18n.t("Dashboard")}
		/>
	);
}
