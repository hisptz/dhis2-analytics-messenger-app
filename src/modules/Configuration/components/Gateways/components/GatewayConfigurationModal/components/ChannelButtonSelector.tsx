import { useFormState, useWatch } from "react-hook-form";
import { WhatsAppSetupButton } from "./WhatsAppSetupModal";
import React from "react";
import { TelegramSetupButton } from "./TelegramSetupModal";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";

export function ChannelButtonSelector({
	onComplete,
	editMode,
}: {
	onComplete: () => void;
	editMode: boolean;
}) {
	const [channel] = useWatch<{
		channel: "whatsapp" | "telegram" | undefined;
		sessionId: string;
	}>({
		name: ["channel"],
	});
	const { isSubmitting, isValidating } = useFormState();

	if (editMode) {
		const loading = isSubmitting || isValidating;
		return (
			<Button loading={loading} primary onClick={onComplete}>
				{loading ? i18n.t("Saving...") : i18n.t("Save changes")}
			</Button>
		);
	}

	if (!channel) return null;

	if (channel === "whatsapp") {
		return <WhatsAppSetupButton onComplete={onComplete} />;
	}

	if (channel === "telegram") {
		return <TelegramSetupButton onComplete={onComplete} />;
	}

	return null;
}
