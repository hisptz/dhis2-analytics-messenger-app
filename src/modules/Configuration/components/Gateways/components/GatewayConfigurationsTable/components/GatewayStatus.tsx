import React from "react";
import { CircularLoader, Tag } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { capitalize } from "lodash";
import { useGatewayStatus } from "../hooks/status";

export interface GatewayStatusProps {
	gateway: Parse.Object;
	channel: string;
}

export function GatewayStatus({ gateway, channel }: GatewayStatusProps) {
	const { isError, isLoading, data } = useGatewayStatus({ gateway, channel });

	if (isError) {
		return <span>Error</span>;
	}
	if (isLoading) {
		return (
			<>
				<CircularLoader extrasmall />
			</>
		);
	}

	return (
		<Tag bold positive={data?.status === "CONNECTED"}>
			{capitalize(data?.status) ?? i18n.t("Unknown")}
		</Tag>
	);
}
