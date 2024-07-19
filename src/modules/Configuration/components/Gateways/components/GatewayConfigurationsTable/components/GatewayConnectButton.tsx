import React from "react";
import { SupportedChannels } from "../../../../../../../shared/interfaces";
import { WhatsAppGatewayConnectButton } from "./WhatsAppGatewayConnectButton";

export interface GatewayConnectButtonProps {
	gateway: Parse.Object;
	channel: SupportedChannels;
}

export function GatewayConnectButton({
	gateway,
	channel,
}: GatewayConnectButtonProps) {
	console.log({ channel });
	switch (channel) {
		case SupportedChannels.WHATSAPP:
			return <WhatsAppGatewayConnectButton gateway={gateway} />;
		default:
			return null;
	}
}
