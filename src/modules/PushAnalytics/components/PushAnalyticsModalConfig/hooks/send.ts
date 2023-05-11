import axios from "axios";
import {useBoolean} from "usehooks-ts";
import {useAlert} from "@dhis2/app-runtime";
import {Contact, PushAnalytics} from "../../../../../shared/interfaces";
import {useCallback} from "react";
import {compact, find, isEmpty} from "lodash";
import {asyncify, mapSeries} from "async-es";
import i18n from "@dhis2/d2-i18n";
import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../../Configuration/components/Gateway/schema";

async function getImage(visualizationId: string, gateway: Gateway) {
    try {
        const response = await axios.get(`${gateway.visualizerURL.trim()}/generate/${visualizationId}`)
        if (response.status === 200) {
            return response.data?.image;
        }
    } catch (e) {

    }
}

async function sendMessage(message: any, gateway: string) {

    try {
        const response = await axios.post(`${gateway.trim()}/send`, message,)
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

    async function getMessage(vis: { id: string; name: string }, {recipients, description, gateway}: {
        description: string;
        recipients: Contact[],
        gateway: Gateway
    }) {
        const visualization = await getImage(vis.id, gateway);
        if (visualization) {
            return {
                to: recipients,
                message: {
                    type: "image",
                    image: visualization,
                    text: description ?? "Push analytics from your DHIS2"
                }
            }
        }
    }

    const send = useCallback(
        async ({gateway, visualizations, contacts, description}: PushAnalytics) => {
            try {
                startLoading();
                const gatewayConf = find(gateways as Gateway[], ['id', gateway]);
                if (!gatewayConf) {
                    endLoading()
                    return;
                }
                const url = gatewayConf.whatsappURL;

                const messages = compact(await mapSeries(visualizations, asyncify(async (visualization: any) => await getMessage(visualization, {
                    recipients: contacts,
                    description: description ?? " ",
                    gateway: gatewayConf
                }))));

                if (isEmpty(messages)) {
                    show({message: i18n.t("Could not send any visualizations to user"), type: {critical: true}});
                    return;
                }

                await mapSeries(messages, asyncify(async (message: any) => await sendMessage(message, url)));

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
