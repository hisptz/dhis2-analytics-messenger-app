import React from "react";
import { useGatewayStatus } from "../hooks/status";
import { Button, ButtonStrip, CircularLoader, IconDelete24 } from "@dhis2/ui";

export interface GatewayActionsProps {
	gateway: Parse.Object;
	channel: string;
}

export function GatewayActions({ gateway, channel }: GatewayActionsProps) {
	const { isLoading, isError } = useGatewayStatus({ gateway, channel });

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
		<ButtonStrip>
			<Button icon={<IconDelete24 />} />
		</ButtonStrip>
	);
}
