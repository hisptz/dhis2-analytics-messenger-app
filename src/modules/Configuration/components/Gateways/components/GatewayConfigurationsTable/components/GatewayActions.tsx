import React from "react";
import { useGatewayStatus } from "../hooks/status";
import { CircularLoader, Tooltip } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { GatewayStartButton } from "./StartButton";
import { GatewayDisconnectButton } from "./DisconnectButton";
import { GatewayDeleteButton } from "./DeleteButton";
import { GatewayConnectButton } from "./GatewayConnectButton";
import { SupportedChannels } from "../../../../../../../shared/interfaces";

export interface GatewayActionsProps {
	gateway: Parse.Object;
	channel: SupportedChannels;
}

export function GatewayActions({ gateway, channel }: GatewayActionsProps) {
	const { isLoading, isError, data, refetch } = useGatewayStatus({
		gateway,
		channel,
	});

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
		<div className="row gap-8 align-center">
			<Tooltip content={i18n.t("Remove gateway")}>
				<GatewayDeleteButton channel={channel} gateway={gateway} />
			</Tooltip>
			{data?.status === "NOT STARTED" ? (
				<Tooltip content={i18n.t("Start gateway")}>
					<GatewayStartButton
						refetch={refetch}
						channel={channel}
						gateway={gateway}
					/>
				</Tooltip>
			) : null}
			{data?.status.toUpperCase() === "CONNECTED" ? (
				<Tooltip content={i18n.t("Disconnect gateway")}>
					<GatewayDisconnectButton
						refetch={refetch}
						gateway={gateway}
						channel={channel}
					/>
				</Tooltip>
			) : null}
			{data?.status.toUpperCase() === "DISCONNECTED" ? (
				<Tooltip content={i18n.t("Connect gateway")}>
					<GatewayConnectButton gateway={gateway} channel={channel} />
				</Tooltip>
			) : null}
		</div>
	);
}
