import {useAlert, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {GATEWAY_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {Gateway} from "../schema";
import i18n from '@dhis2/d2-i18n';
// TODO add mechanism for pagination
const query = {
    gateways: {
        resource: `dataStore/${GATEWAY_DATASTORE_KEY}`,
        params: ({page, pageSize}: any) => ({
            fields: [
                "id",
                "name",
                "whatsappURL",
                "visualizerURL",
                "chatBotURL"
            ],
            page: page ?? 1,
            pageSize: pageSize ?? 10,
        }),
    },
};

const deleteMutation: any = {
    type: "delete",
    resource: `dataStore/${GATEWAY_DATASTORE_KEY}`,
    id: ({id}: { id: string }) => id
}

export function useGateways() {
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const {data, loading, error, refetch} = useDataQuery<{
        gateways: { pager: any; entries: (Gateway & { key: string })[] }
    }>(query);
    const [deleteGateway,] = useDataMutation(deleteMutation, {
        onComplete: () => {
            show({message: i18n.t("Gateway deleted successfully"), type: {success: true}})
        },
        onError: (error) => {
            show({message: `${i18n.t("Error deleting gateway")}: ${error.message}`, type: {critical: true}})
        }
    })

    const {entries, pager} = data?.gateways ?? {};

    return {
        loading,
        deleteGateway,
        error,
        gateways: entries ?? [],
        refetch
    }
}
