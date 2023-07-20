import i18n from "@dhis2/d2-i18n";

export const ANALYTICS_GROUPS_DATASTORE_KEY = "hisptz-analytics-groups";
export const GATEWAY_DATASTORE_KEY = "hisptz-analytics-gateways";
export const PUSH_ANALYTICS_DATASTORE_KEY = "hisptz-push-analytics";


export const predefinedSchedules = [
    {
        label: i18n.t("Every 2 minutes"),
        value: "*/2 * * * *"
    },
    {
        label: i18n.t("Every 5 minutes"),
        value: "*/5 * * * *"
    },
    {
        label: i18n.t("Every 10 minutes"),
        value: "*/10 * * * *"
    },
    {
        label: i18n.t("Every hour"),
        value: "0 * * * *"
    },
    {
        label: i18n.t("Every day at midnight"),
        value: "0 0 * * *"
    },
    {
        label: i18n.t("Every day at noon"),
        value: "0 12 * * *"
    },
    {
        label: i18n.t("Every week on Monday"),
        value: "0 0 * * 1"
    }
]
