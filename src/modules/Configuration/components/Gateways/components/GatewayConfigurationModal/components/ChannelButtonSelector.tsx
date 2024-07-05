import { useWatch } from "react-hook-form";
import { WhatsAppSetupButton } from "./WhatsAppSetupModal";
import React from "react";

export function ChannelButtonSelector({
	onComplete,
}: {
	onComplete: () => void;
}) {
	const [channel] = useWatch<{
		channel: "whatsapp" | "telegram" | undefined;
		sessionId: string;
	}>({
		name: ["channel"],
	});

	if (!channel) return null;

	if (channel === "whatsapp") {
		return <WhatsAppSetupButton onComplete={onComplete} />;
	}
}
