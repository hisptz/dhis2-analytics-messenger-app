import React, { useMemo } from "react";
import i18n from "@dhis2/d2-i18n";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { useCustomReports } from "../../../hooks/customReports";

export function CustomReportSelector() {
	const { customReports, error, loading } = useCustomReports();

	const options = useMemo(
		() =>
			customReports.map(({ id, name }) => ({
				label: name,
				value: id,
			})),
		[customReports],
	);

	return (
		<RHFSingleSelectField
			loading={loading}
			helpText={
				error
					? `${i18n.t("Error getting custom reports")}: ${error.message}`
					: undefined
			}
			name="customReport"
			options={options}
			label={i18n.t("Custom Report")}
		/>
	);
}
