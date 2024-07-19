import { useWatch } from "react-hook-form";
import i18n from "@dhis2/d2-i18n";
import { useMemo } from "react";
import { filter, map } from "lodash";

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

export function useRecipientOptions(channel?: string) {
	return useMemo(
		() =>
			map(
				filter(
					allOptions,
					(option) => channel && option.channels.includes(channel),
				),
				(option: any) => ({
					label: option.label,
					value: option.value,
				}),
			),
		[channel],
	);
}
