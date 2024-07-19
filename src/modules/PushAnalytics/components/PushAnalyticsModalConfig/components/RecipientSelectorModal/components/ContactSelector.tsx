import React from "react";
import i18n from "@dhis2/d2-i18n";
import { useWatch } from "react-hook-form";
import { Group } from "../../RHFRecipientSelector/components/Group/Group";
import { PhoneNumber } from "../../RHFRecipientSelector/components/PhoneNumber";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { useRecipientOptions } from "../../../hooks/recipientOptions";

export function ContactSelector(): React.ReactElement {
	const [type, channel] = useWatch({
		name: ["type", "channel"],
	});
	const recipientOptions = useRecipientOptions();

	return (
		<>
			<RHFSingleSelectField
				disabled={!channel}
				label={i18n.t("Type")}
				options={recipientOptions}
				name={"type"}
			/>
			{type === "user" && <></>}
			{type === "whatsappGroup" && <Group gatewayType="whatsapp" />}
			{type === "telegramGroup" && <Group gatewayType="telegram" />}
			{type === "whatsappPhoneNumber" && (
				<PhoneNumber gatewayType="whatsapp" />
			)}
			{type === "telegramPhoneNumber" && (
				<PhoneNumber gatewayType="telegram" />
			)}
		</>
	);
}
