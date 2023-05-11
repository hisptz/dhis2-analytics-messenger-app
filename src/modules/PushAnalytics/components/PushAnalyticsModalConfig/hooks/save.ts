import {PUSH_ANALYTICS_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {useCallback, useMemo} from "react";
import {uid} from "@hisptz/dhis2-utils";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";

const generateCreateMutation = (id: string): any => ({
    type: "create",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}/${id}`,
    data: ({data}: any) => data
})
const updateMutation: any = {
    type: "update",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
    id: ({id}: any) => id,
    data: ({data}: any) => data
}

export function useSaveConfig(defaultConfig?: PushAnalytics | null) {
    const id = useMemo(() => uid(), []);
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const [create, {loading: creating}] = useDataMutation(generateCreateMutation(id), {
        onComplete: () => {
            show({message: i18n.t("Configuration saved successfully"), type: {success: true}})
        },
        onError: (error) => {
            show({message: `${i18n.t("Error saving configuration")}: ${error.message}`, type: {critical: true}})
        }
    })
    const [update, {loading: updating}] = useDataMutation(updateMutation, {
        onComplete: () => {
            show({message: i18n.t("Configuration updated successfully"), type: {success: true}})
        },
        onError: (error) => {
            show({message: `${i18n.t("Error updating configuration")}: ${error.message}`, type: {critical: true}})
        }
    })

    const save = useCallback(
        async (data: PushAnalytics) => {
            if (defaultConfig) {
                await update({
                    data,
                    id: defaultConfig.id
                })
            } else {
                const newData = {
                    ...data,
                    id
                }
                await create({
                    data: newData
                })
            }
        },
        [id, create, update],
    );

    return {
        creating,
        updating,
        save
    }
}
