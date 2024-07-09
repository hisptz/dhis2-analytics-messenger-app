import { ParseClass } from "../../../../../shared/constants/parse";
import i18n from "@dhis2/d2-i18n";

export const channels = [
	{
		name: "whatsapp",
		className: ParseClass.WHATSAPP_CLIENT,
		label: i18n.t("WhatsApp"),
	},
	{
		name: "telegram",
		className: ParseClass.TELEGRAM_CLIENT,
		label: i18n.t("Telegram"),
	},
];
