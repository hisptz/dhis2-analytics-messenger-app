import {useSetting} from "@dhis2/app-service-datastore";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";


export function PredefinedSelector() {
    const [predefinedSchedules] = useSetting("predefinedSchedules", {global: true})
    return (
        <RHFSingleSelectField label={i18n.t("Select time")} options={predefinedSchedules} name={"cron"}/>
    )

}
