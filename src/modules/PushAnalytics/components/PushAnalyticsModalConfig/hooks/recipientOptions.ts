import i18n from "@dhis2/d2-i18n";
import { useMemo } from "react";
import { map } from "lodash";
import { useSelectedRecipientGateway } from "./gatewayChanelOptions";

const allOptions: Array<{ label: string; value: string; channels: string[] }> =
	[
		{
			label: i18n.t("Whatsapp Group"),
			value: "whatsappGroup",
			channels: ["whatsapp"],
		},
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
	const gateway = useSelectedRecipientGateway();

	return useMemo(
		() =>
			gateway
				? map(
						allOptions.filter(({ channels }) =>
							channels.includes(gateway?.channel),
						),
						(option) => ({
							label: option.label,
							value: option.value,
						}),
					)
				: [],
		[gateway],
	);
}
