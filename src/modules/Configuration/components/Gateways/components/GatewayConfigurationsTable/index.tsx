import React from "react";
import {
	DataTable,
	DataTableColumnHeader,
	DataTableHead,
	DataTableRow,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";

export default function GatewayConfigurationsTable(): React.ReactElement {
	return (
		<div className="w-100 h-100">
			<DataTable>
				<DataTableHead>
					<DataTableRow>
						<DataTableColumnHeader>
							{i18n.t("S/N")}
						</DataTableColumnHeader>
						<DataTableColumnHeader>
							{i18n.t("Gateway Name")}
						</DataTableColumnHeader>
						<DataTableColumnHeader>
							{i18n.t("Messaging Channel")}
						</DataTableColumnHeader>
						<DataTableColumnHeader>
							{i18n.t("Status")}
						</DataTableColumnHeader>
						<DataTableColumnHeader>
							{i18n.t("Actions")}
						</DataTableColumnHeader>
					</DataTableRow>
				</DataTableHead>
			</DataTable>
		</div>
	);
}
