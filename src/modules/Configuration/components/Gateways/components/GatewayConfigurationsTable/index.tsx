import React, { useMemo } from "react";
import { Button, CircularLoader, IconAdd24 } from "@dhis2/ui";
import { CustomDataTable, CustomDataTableRow } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import { useGateways } from "./hooks/data";
import { isEmpty } from "lodash";
import { useBoolean } from "usehooks-ts";
import { GatewayConfigurationModal } from "../GatewayConfigurationModal";
import { GatewayStatus } from "./components/GatewayStatus";
import { GatewayActions } from "./components/GatewayActions";

const columns = [
	{
		label: i18n.t("S/N"),
		key: "sn",
	},
	{
		label: i18n.t("Gateway Name"),
		key: "name",
	},
	{
		label: i18n.t("Messaging Channel"),
		key: "channel",
	},
	{
		label: i18n.t("Status"),
		key: "status",
	},
	{
		label: i18n.t("Actions"),
		key: "actions",
	},
];

export default function GatewayConfigurationsTable(): React.ReactElement {
	const {
		setFalse: onOpen,
		setTrue: onClose,
		value: hide,
	} = useBoolean(true);
	const { data, loading, error } = useGateways();

	const rows = useMemo(
		() =>
			data
				?.map((row) => {
					if (!row) return null;
					return {
						id: row.data.id,
						...row,
						...(row?.data.attributes ?? {}),
						status: (
							<GatewayStatus
								key={row.data.id}
								gateway={row?.data}
								channel={row.channel}
							/>
						),
						actions: (
							<GatewayActions
								gateway={row.data}
								channel={row.channel}
							/>
						),
					};
				})
				.filter((value) => !!value) as CustomDataTableRow[],
		[data],
	);

	if (loading) {
		return (
			<div className="w-100 h-100 center column align-center">
				<CircularLoader small />
			</div>
		);
	}

	if (!isEmpty(error)) {
		return (
			<div className="w-100 h-100 center column align-center">
				<h3>
					{i18n.t(
						"We encountered some errors while retrieving your gateways",
					)}
				</h3>
				{error.map((error) => (
					<span key={error.name}>{error.message}</span>
				))}
			</div>
		);
	}

	return (
		<div className="w-100 h-100 column gap-16">
			<div>
				<Button onClick={onOpen} icon={<IconAdd24 />} primary>
					{i18n.t("Add gateway")}
				</Button>
				{!hide && (
					<GatewayConfigurationModal onClose={onClose} hide={hide} />
				)}
			</div>
			<div className="flex-1">
				<CustomDataTable
					loading={loading}
					emptyLabel={i18n.t("There are no configured gateways")}
					columns={columns}
					rows={rows}
				/>
			</div>
		</div>
	);
}
