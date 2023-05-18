import axios from "axios";
import {useBoolean} from "usehooks-ts";
import {useAlert} from "@dhis2/app-runtime";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {useCallback} from "react";
import {find} from "lodash";
import i18n from "@dhis2/d2-i18n";
import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../../Configuration/components/Gateway/schema";

async function sendMessages({gateway, contacts, visualizations, description}: {
    contacts: { type: string; number: string }[],
    visualizations: { id: string; name: string }[],
    gateway: Gateway;
    description: string;

}) {

    try {
        const url = gateway.chatBotURL;
        const response = await axios.post(`${url}/push`, {
            to: contacts,
            visualizations,
            description
        },)
        if (response.status === 200) {
            return response.data;
        }
    } catch (e: any) {
        console.error(e)
        throw Error(`${i18n.t("Could not send message")}: ${e.message}`)
    }
}

export function useSendAnalytics() {
    const {value: loading, setTrue: startLoading, setFalse: endLoading} = useBoolean(false);
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}))
    const {gateways} = useGateways();

    const send = useCallback(
        async ({gateway, visualizations, contacts, description}: PushAnalytics) => {
            try {
                startLoading();
                const gatewayConf = find(gateways as Gateway[], ['id', gateway]);
                if (!gatewayConf) {
                    endLoading()
                    return;
                }

                await sendMessages({
                    contacts,
                    visualizations,
                    description,
                    gateway: gatewayConf
                } as any);


                show({message: i18n.t("Messages successfully sent"), type: {success: true}})
                endLoading()
            } catch (e: any) {
                show({message: `${i18n.t("Error sending message(s)")}: ${e.message}`, type: {critical: true}})
            }
        },
        [gateways],
    );

    return {
        send,
        loading
    }
}
