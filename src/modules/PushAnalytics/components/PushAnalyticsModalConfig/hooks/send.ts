import axios from "axios";
import {useAlert} from "@dhis2/app-runtime";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {useCallback} from "react";
import i18n from "@dhis2/d2-i18n";
import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {Gateway} from "../../../../Configuration/components/Gateway/schema";
import {useMutation} from "@tanstack/react-query";
import {find} from "lodash";

async function sendMessage({id, gateway}: { id: string, gateway: Gateway }) {
    const {url, apiKey} = gateway;
    const response = await axios.get(`/bot/jobs/${id}/push`, {
        baseURL: url,
        withCredentials: true,
        headers: {
            'x-api-key': apiKey,
        }
    });
    const {data} = response;
    if (response.status === 200) {
        return data;
    } else {
        throw new Error(data.message);
    }
}

export function useSendAnalytics() {
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}))
    const {gateways} = useGateways();
    const mutation = useMutation([], {
        mutationFn: sendMessage
    })

    const send = useCallback(
        async ({gateway, visualizations, contacts, description, id}: PushAnalytics) => {
            try {
                const gatewayObject = find(gateways, {id: gateway})
                if (!gatewayObject) {
                    throw new Error(i18n.t("Gateway not found"))
                }
                mutation.mutate({
                    id,
                    gateway: gatewayObject
                }, {
                    onSuccess: () => {
                        show({message: i18n.t("Message sent successfully"), type: {critical: false}})
                    },
                    onError: (e: any) => {
                        show({message: `${i18n.t("Error sending message(s)")}: ${e.message}`, type: {info: true}})
                    }
                })

            } catch (e: any) {
                show({message: `${i18n.t("Error sending message(s)")}: ${e.message}`, type: {critical: true}})
            }
        },
        [gateways],
    );

    return {
        send,
        loading: mutation.isLoading
    }
}
