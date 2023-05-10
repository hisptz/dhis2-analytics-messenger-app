import axios from "axios";
import {useBoolean} from "usehooks-ts";
import {useAlert} from "@dhis2/app-runtime";
import {useSavedObject} from "@dhis2/app-service-datastore";
import {Contact, PushAnalytics} from "../../../../../shared/interfaces";
import {useCallback} from "react";
import {compact, find, isEmpty} from "lodash";
import {asyncify, mapSeries} from "async-es";
import i18n from "@dhis2/d2-i18n";

async function getImage(visualizationId: string) {
    try {
        const response = await axios.get(`https://vmi368782.contaboserver.net/dev/visualizer/api/generate/${visualizationId}`)
        if (response.status === 200) {
            return response.data?.image;
        }
    } catch (e) {

    }
}

async function sendMessage(message: any, gateway: string) {

    try {
        const response = await axios.post(`${gateway}/send`, message,)
        if (response.status === 200) {
            return response.data;
        }
    } catch (e) {
        console.error(e)
        throw Error("Could not send message")
    }
}

export function useSendAnalytics() {
    const {value: loading, setTrue: startLoading, setFalse: endLoading} = useBoolean(false);
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}))

    const [gateways] = useSavedObject(`gateways`);


    async function getMessage(vis: { id: string; name: string }, {recipients, description}: {
        description: string;
        recipients: Contact[]
    }) {
        const visualization = await getImage(vis.id);
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
            startLoading();
            const gatewayConf = find(gateways as any[], ['id', gateway]);
            if (!gatewayConf) {
                endLoading()
                return;
            }
            const url = gatewayConf.url;

            const messages = compact(await mapSeries(visualizations, asyncify(async (visualization: any) => await getMessage(visualization, {
                recipients: contacts,
                description: description ?? " "
            }))));

            if (isEmpty(messages)) {
                show({message: i18n.t("Could not send any visualizations to user"), type: {critical: true}});
                return;
            }

            const responses = await mapSeries(messages, asyncify(async (message: any) => await sendMessage(message, url)));

            console.log(responses);
            show({message: i18n.t("Messages successfully sent"), type: {success: true}})
            endLoading()
        },
        [],
    );


    return {
        send,
        loading
    }
}
