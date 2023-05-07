import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Button, IconAdd16} from "@dhis2/ui";
import GatewayConfigurationsTable from "./components/GatewayConfigurationsTable";
import {useBoolean} from "usehooks-ts";
import {GatewayConfigurationModal} from "./components/GatewayConfigurationModal";

export default function GatewayConfiguration(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true)

    return (
        <div>
            <GatewayConfigurationModal onClose={hide} hidden={hidden}/>

            <p className="sub-module-title">{i18n.t("Gateway")}</p>
            <p className="sub-module-subtitle">
                {i18n.t("Configuration of the gateways for push analytics")}
            </p>

            <div className="pt-16">
                <Button

                    primary
                    name="Gateway"
                    onClick={open}
                    value="gatewayButton"
                    icon={<IconAdd16/>}
                >
                    {i18n.t("Add gateway")}
                </Button>
            </div>

            <div className="pt-8">
                <GatewayConfigurationsTable/>
            </div>
        </div>
    );
}
