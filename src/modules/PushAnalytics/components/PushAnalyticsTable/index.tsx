import React, {useCallback, useMemo} from "react";
import i18n from "@dhis2/d2-i18n";
import {Column, Contact, PushAnalytics} from "../../../../shared/interfaces";
import {PUSH_ANALYTICS_DATASTORE_KEY} from "../../../../shared/constants/dataStore";
import {useAlert, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import CustomTable from "../../../../shared/components/CustomTable";
import EmptyPushAnalyticsList from "../EmptyPushAnalyticsList";
import {useBoolean} from "usehooks-ts";
import {PushAnalyticsModalConfig} from "../PushAnalyticsModalConfig";
import {find, isEmpty} from "lodash";
import {Button, Chip, IconAdd24, IconDelete24, IconEdit24, IconUser24, IconUserGroup24} from "@dhis2/ui"
import FullPageLoader from "../../../../shared/components/Loaders";
import {useSavedObject} from "@dhis2/app-service-datastore";
import {ActionButton} from "../../../../shared/components/CustomDataTable/components/ActionButton";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {useConfirmDialog} from "@hisptz/dhis2-ui";

const tableColumns: Column[] = [
    {
        label: i18n.t("S/N"),
        key: "index",
    },
    {
        label: i18n.t("Name"),
        key: "name",
    },
    {
        label: i18n.t("Gateway"),
        key: "gateway",
    },
    {
        label: i18n.t("Recipients"),
        key: "contacts",
    },
    {
        label: i18n.t("Actions"),
        key: "actions",
    },
];


const pushAnalyticsConfigQuery = {
    config: {
        resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
        params: {
            fields: [
                'id',
                'name',
                'gateway',
                'contacts',
                'group',
                'visualizations',
                'description'
            ]
        }
    }
}


const deleteMutation: any = {
    type: "delete",
    resource: `dataStore/${PUSH_ANALYTICS_DATASTORE_KEY}`,
    id: ({id}: { id: string }) => id
}

export const ConfigUpdateState = atom<PushAnalytics | null>({
    key: 'config-update-state',
    default: null
})

function usePushAnalyticsConfig({onEdit}: { onEdit: () => void }) {
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const setUpdateConfig = useSetRecoilState(ConfigUpdateState);
    const {data, loading, refetch} = useDataQuery<{
        config: { entries: Array<PushAnalytics & { key: string }> }
    }>(pushAnalyticsConfigQuery);
    const [deleteConfig, {loading: deleting}] = useDataMutation(deleteMutation, {
        onComplete: () => {
            show({message: i18n.t("Configuration deleted successfully"), type: {success: true}});
            refetch()
        },
        onError: (error) => {
            show({message: `${i18n.t("Could not delete configuration:")}: ${error.message}`, type: {critical: true}})
        }
    });
    const {confirm} = useConfirmDialog();

    const [gateways] = useSavedObject(`gateways`)
    const configs = useMemo(() => {
        return data?.config?.entries?.map((config, index) => {
            const gateway = find((gateways as any[]), ['id', config.gateway]);
            const contacts = config?.contacts;
            return {
                ...config,
                index: index + 1,
                gateway: gateway?.name,
                contacts: <div style={{gap: 8, flexWrap: "wrap"}} className="row">
                    {
                        contacts?.map(({number, type}: Contact) => (
                            <Chip key={`${number}-recipient`} icon={type === 'group' ? <IconUserGroup24/> :
                                <IconUser24/>}>{number}</Chip>))
                    }
                </div>,
                actions: <ActionButton actions={[
                    {
                        key: `edit-config`,
                        label: i18n.t("Edit"),
                        icon: <IconEdit24/>,
                        onClick: () => {
                            setUpdateConfig(config);
                            onEdit();
                        }
                    },
                    {
                        key: `delete-config`,
                        label: i18n.t("Delete"),
                        icon: <IconDelete24/>,
                        onClick: () => {
                            confirm({
                                loadingText: i18n.t("Deleting..."),
                                confirmButtonText: i18n.t("Delete"),
                                title: i18n.t("Confirm delete"),
                                message: i18n.t("Are you sure you want to delete the configuration {{name}}?", {
                                    name: config.name
                                }),
                                onCancel: () => {
                                },
                                onConfirm: async () => {
                                    await deleteConfig({
                                        id: config.key
                                    });
                                }
                            })
                        }
                    }
                ]} row={config}/>
            }
        })
    }, [data]);

    return {
        data: configs,
        loading,
        refetch
    }
}

export default function PushAnalyticsTable(): React.ReactElement {
    const {value: hidden, setTrue: hide, setFalse: open} = useBoolean(true);
    const {data, loading, refetch} = usePushAnalyticsConfig({onEdit: open});
    const configUpdate = useRecoilValue(ConfigUpdateState);

    const onClose = useCallback(() => {
        hide();
        refetch()
    }, [])

    if (loading) {
        return (<FullPageLoader/>)
    }

    return (
        <>
            <PushAnalyticsModalConfig config={configUpdate} hidden={hidden} onClose={onClose}/>
            {isEmpty(data) ? <EmptyPushAnalyticsList anAddPushAnalytics={open}/> :
                <div className="column gap-16" style={{width: "100%"}}>
                    <div>
                        <Button onClick={open} primary
                                icon={<IconAdd24/>}>{i18n.t("Add push analytics configuration")}</Button>
                    </div>
                    <CustomTable columns={tableColumns} data={data as any} pagination={undefined}/>
                </div>}

        </>
    );
}
