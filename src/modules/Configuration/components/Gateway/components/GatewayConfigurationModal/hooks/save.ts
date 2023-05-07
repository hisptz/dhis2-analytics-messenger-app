import {useSavedObject} from "@dhis2/app-service-datastore";
import {useCallback} from "react";
import {GatewayConfig} from "../index";
import {uid} from "@hisptz/dhis2-utils";
import {cloneDeep, findIndex, isEmpty, set} from "lodash";
import {useAlert} from "@dhis2/app-runtime";
import i18n from '@dhis2/d2-i18n';

export function useSaveGateway() {
    const [value, {replace}] = useSavedObject(`gateways`,);
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: { type: Record<string, any> }) => ({
        ...type,
        duration: 3000
    }))

    const save = useCallback(async (config: GatewayConfig) => {
        const id = config.id;
        const index = findIndex(value as any, ['id', id]);
        if (index === -1) {
            const newConfig = {
                ...config,
                id: uid()
            }
            if (isEmpty(value)) {
                await replace([
                    newConfig
                ])
            } else {
                await replace([
                    ...(value as any),
                    newConfig
                ])
            }
            show({message: i18n.t("Gateway config saved successfully"), type: {success: true}})
        } else {
            const updatedValue = cloneDeep(value);
            set(updatedValue, [index], config);
            await replace(updatedValue);
            show({message: i18n.t("Gateway config updated successfully"), type: {success: true}})

        }

    }, [replace, value]);

    return {
        save
    }
}
