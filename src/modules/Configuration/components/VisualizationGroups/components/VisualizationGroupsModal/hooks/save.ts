import {useCallback} from "react";
import {VisualizationGroupConfig} from "../index";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {ANALYTICS_GROUPS_DATASTORE_KEY} from "../../../../../../../shared/constants/dataStore";
import {uid} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n';

const generateCreateQuery = (id: string) => ({
    type: "create",
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}/${id}`,
    data: ({data}: any) => data,
})

const updateGroupMutation = {
    type: "update",
    resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
    data: ({data}: any) => data,
    id: ({id}: any) => id
}

export function useSaveVisualizationGroup(group?: VisualizationGroupConfig) {
    const id = group?.id ?? uid();
    const [create, {loading: creating}] = useDataMutation(generateCreateQuery(id));
    const [update, {loading: updating}] = useDataMutation(updateGroupMutation)
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: { type: Record<string, any> }) => ({
        ...type,
        duration: 3000
    }))

    const save = useCallback(async (data: VisualizationGroupConfig) => {
        if (group) {
            await update({
                data,
                id: group.id
            })
            show({message: i18n.t("Group updated successfully"), type: {success: true}})
        } else {
            const newGroup = {
                ...data,
                id: uid()
            }
            await create({
                data: newGroup,
                id: newGroup.id
            })
            show({message: i18n.t("Group created successfully"), type: {success: true}})
        }
    }, [create, update]);

    return {
        save,
        creating,
        updating
    }
}
