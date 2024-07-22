import { ParseClass } from "./parse";
import i18n from "@dhis2/d2-i18n";
import { SupportedChannels } from "../interfaces";

export const channels = [
	{
		name: SupportedChannels.WHATSAPP,
		id: SupportedChannels.WHATSAPP,
		className: ParseClass.WHATSAPP_CLIENT,
		label: i18n.t("WhatsApp"),
	},
	{
		name: SupportedChannels.TELEGRAM,
		id: SupportedChannels.TELEGRAM,
		className: ParseClass.TELEGRAM_CLIENT,
		label: i18n.t("Telegram"),
	},
];
