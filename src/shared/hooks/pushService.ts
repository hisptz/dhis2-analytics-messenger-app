import axios from "axios";
import {useCallback} from "react";
import {useGateways} from "../../modules/Configuration/components/Gateway/hooks/data";

export function usePushServiceClient() {
    const {gateways} = useGateways();
    return useCallback((gatewayId: string) => {
        const gateway = gateways.find(g => g.id === gatewayId);
        if (!gateway) {
            throw new Error("Gateway not found");
        }
        return axios.create({
            baseURL: gateway.url,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": gateway.apiKey
            },
        });
    }, [gateways]);
}
