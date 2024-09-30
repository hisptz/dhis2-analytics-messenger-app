import { Button, IconEdit24 } from "@dhis2/ui";
import React from "react";
import Parse from "parse";
import { useBoolean } from "usehooks-ts";
import { GatewayConfigurationModal } from "../../GatewayConfigurationModal";
import { SupportedChannels } from "../../../../../../../shared/interfaces";

export interface GatewayEditButtonProps {
	gateway: Parse.Object;
	channel: SupportedChannels;
}

export function GatewayEditButton({
	gateway,
	channel,
}: GatewayEditButtonProps) {
	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);

	return (
		<>
			<GatewayConfigurationModal
				onClose={onClose}
				hide={hide}
				defaultValue={gateway}
				channel={channel}
			/>
			<Button onClick={onOpen} icon={<IconEdit24 />} />
		</>
	);
}
