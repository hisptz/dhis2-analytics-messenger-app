import { ParseClass } from "../../../../../shared/constants/parse";
import i18n from "@dhis2/d2-i18n";
import { SupportedChannels } from "../../../../../shared/interfaces";

export const channels = [
	{
		name: SupportedChannels.WHATSAPP,
		className: ParseClass.WHATSAPP_CLIENT,
		label: i18n.t("WhatsApp"),
	},
	{
		name: SupportedChannels.TELEGRAM,
		className: ParseClass.TELEGRAM_CLIENT,
		label: i18n.t("Telegram"),
	},
];
