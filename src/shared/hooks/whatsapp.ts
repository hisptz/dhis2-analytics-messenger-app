import {useGateways} from "../../modules/Configuration/components/Gateway/hooks/data";
import {useEffect, useMemo} from "react";
import {head} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {Gateway} from "../../modules/Configuration/components/Gateway/schema";
import axios from "axios";


async function getWhatsappData(gateway?: Gateway) {
    try {
        if (!gateway) {
            return;
        }
        const whatsappURL = gateway.whatsappURL as string;
        const response = await axios.get(`/groups`, {baseURL: whatsappURL} as any);
        return response.data;
    } catch (e) {

    }
}

export function useWhatsappData() {
    const {gateways} = useGateways();
    const gateway = useMemo(() => head(gateways), [gateways]);
    const {
        data,
        isLoading,
        refetch,
        isRefetching
    } = useQuery([gateway, 'whatsapp'], async () => getWhatsappData(gateway), {
        enabled: !!gateway,
        refetchOnWindowFocus: false
    })

    const groups = useMemo(() => data?.groups ?? [], [data]);

    useEffect(() => {
        if (gateway) {
            refetch()
        }
    }, [gateway]);


    return {
        groups,
        loading: isLoading || isRefetching
    }
}
