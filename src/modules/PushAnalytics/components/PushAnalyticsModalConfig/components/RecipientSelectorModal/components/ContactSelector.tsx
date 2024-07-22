import React, { useEffect } from "react";
import i18n from "@dhis2/d2-i18n";
import { useFormContext, useWatch } from "react-hook-form";
import { Group } from "../../RHFRecipientSelector/components/Group/Group";
import { PhoneNumber } from "../../RHFRecipientSelector/components/PhoneNumber";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { useRecipientOptions } from "../../../hooks/recipientOptions";
import { RecipientData } from "../RecipientSelectorModal";

export function ContactSelector(): React.ReactElement {
	const { clearErrors, resetField } = useFormContext<RecipientData>();
	const [type, gateway] = useWatch<RecipientData>({
		name: ["type", "gatewayId"],
	});

	const recipientOptions = useRecipientOptions();

	useEffect(() => {
		clearErrors("identifier");
		resetField("identifier");
	}, [type]);

	return (
		<>
			<RHFSingleSelectField
				disabled={!gateway}
				label={i18n.t("Type")}
				options={recipientOptions}
				name={"type"}
			/>
			{type === "user" && <></>}
			{type === "whatsappGroup" && <Group key={"whatsapp"} />}
			{type === "telegramGroup" && <Group key={"telegram"} />}
			{type === "whatsappPhoneNumber" && (
				<PhoneNumber gatewayType="whatsapp" />
			)}
			{type === "telegramPhoneNumber" && (
				<PhoneNumber gatewayType="telegram" />
			)}
		</>
	);
}
