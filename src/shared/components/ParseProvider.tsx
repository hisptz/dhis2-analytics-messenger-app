import React, {useEffect} from "react";
import {
    GatewayConfigurationModal
} from "../../modules/Configuration/components/Gateway/components/GatewayConfigurationModal";
import {useBoolean} from "usehooks-ts";
import {useSetting} from "@dhis2/app-service-datastore";
import {loginToParse} from "../utils/parse";
import {useAlert} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";

export function ParseProvider({children}: { children: React.ReactNode }) {
    const {show} = useAlert(({message}) => message, ({type, actions}) => ({...type, actions, duration: 3000}));
    const [config] = useSetting("gatewayConfig", {global: true});
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);

    useEffect(() => {
        if (!config || !config.token) {
            onShow();
        } else {
            try {
                loginToParse(config.token).catch((error) => {
                    show({
                        message: i18n.t("Could not connect to DHIS2 analytics messenger service") + ` ${error.message}`,
                        type: {critical: true},
                        actions: [
                            {
                                label: i18n.t("Change configuration"),
                                onClick: () => onShow()
                            }
                        ]
                    });

                });
            } catch (e: any) {
                show({
                    message: i18n.t("Could not connect to DHIS2 analytics messenger service") + ` ${e.message}`,
                    type: {critical: true}
                });
            }
        }
    }, [config]);


    return <>
        {
            !hide && (<GatewayConfigurationModal onClose={onHide} hide={hide}/>)
        }
        {children}
    </>;
}
