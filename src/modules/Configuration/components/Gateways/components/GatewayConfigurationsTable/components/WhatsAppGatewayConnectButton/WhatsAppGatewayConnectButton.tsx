import { Button, IconLink24 } from "@dhis2/ui";
import React from "react";
import { useBoolean } from "usehooks-ts";
import { WhatsAppConnectModal } from "./components/WhatsAppConnectModal";

export function WhatsAppGatewayConnectButton({
	gateway,
}: {
	gateway: Parse.Object;
}) {
	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);

	return (
		<>
			{!hide && (
				<WhatsAppConnectModal
					hide={hide}
					onClose={onClose}
					gateway={gateway}
				/>
			)}
			<Button onClick={onOpen} icon={<IconLink24 />} />
		</>
	);
}
