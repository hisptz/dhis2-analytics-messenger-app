import { useWatch } from "react-hook-form";
import { useGateways } from "../../../../Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";
import i18n from "@dhis2/d2-i18n";
import { useMemo } from "react";

const allOptions = [
	// {
	// 	label: i18n.t("Whatsapp Group"),
	// 	value: "whatsappGroup",
	// 	channels: ["whatsapp"],
	// },
	// {
	// 	label: i18n.t("Telegram Group"),
	// 	value: "telegramGroup",
	// 	channels: ["telegram"],
	// },
	{
		label: i18n.t("WhatsApp Phone Number"),
		value: "whatsappPhoneNumber",
		channels: ["whatsapp"],
	},
	{
		label: i18n.t("Telegram Phone Number/Username"),
		value: "telegramPhoneNumber",
		channels: ["telegram"],
	},
	// {
	// 	label: i18n.t("Users"),
	// 	value: "user",
	// 	channels: ["whatsapp", "telegram"],
	// },
];

export function useRecipientOptions() {
	const { data } = useGateways();
	const gateways = useWatch({
		name: "gateways",
		defaultValue: [],
	});

	const selectedGateways = gateways.map((gateway: string) => {
		return data.find((gt) => gt?.data.id === gateway);
	});

	return useMemo(() => {
		return allOptions.filter((option) => {
			return option.channels.some((channel) =>
				selectedGateways.some(
					(gateway: { channel: string }) =>
						gateway?.channel.toLowerCase() === channel,
				),
			);
		});
	}, [selectedGateways]);
}
