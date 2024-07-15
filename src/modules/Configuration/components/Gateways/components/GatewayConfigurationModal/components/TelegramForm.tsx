import React from "react";
import { RHFTextInputField } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import { useWatch } from "react-hook-form";

export function TelegramForm() {
	const [channel] = useWatch<{
		channel: "whatsapp" | "telegram" | undefined;
		sessionId: string;
	}>({
		name: ["channel"],
	});

	if (channel !== "telegram") {
		return null;
	}

	return (
		<div className="column gap-8">
			<RHFTextInputField
				name="phoneNumber"
				label={i18n.t("Phone number")}
				required
			/>
		</div>
	);
}
