import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {useCallback, useMemo} from "react";
import {head, uniqBy} from "lodash";
import axios from "axios";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Contact, PushAnalytics} from "../../../../../shared/interfaces";
import i18n from '@dhis2/d2-i18n';
import {useAlert} from "@dhis2/app-runtime";
import {uid} from "@hisptz/dhis2-utils";

function formatData(data: PushAnalytics & { crons: string[] }): {
    id: string;
    schedules: { cron: string; enabled: boolean; id?: string }[],
    data: {
        to: Contact[],
        visualizations: { id: string; name: string }[],
        description: string,
    }
} {

    return {
        data: {
            to: data.contacts,
            visualizations: data.visualizations,
            description: data.description ?? i18n.t("Data from analytics messenger"),
        },
        id: data.id as string,
        schedules: data.crons.map((cron) => {
            return {
                cron,
                enabled: true,
                id: uid()
            }
        })
    }
}

async function create(data: PushAnalytics & { crons: string[] }, {gateway}: { gateway: string }) {
    const payload = formatData(data);
    try {
        const response = await axios.post(`/schedule`, {
            ...payload
        }, {
            baseURL: gateway
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function update(defaultValue: any, crons: string[], {gateway}: { gateway: string }) {
    try {
        const response = await axios.put(`/schedule/${defaultValue.id}`, {
            ...defaultValue,
            schedules: uniqBy([
                ...defaultValue.schedules,
                ...(crons.map((cron) => {
                    return {
                        cron,
                        enabled: true,
                        id: uid()
                    }
                }))
            ], 'cron')
        }, {
            baseURL: gateway
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


export function usePushSchedule(id: string) {
    const {gateways} = useGateways();
    const gateway = useMemo(() => head(gateways), [gateways]);

    async function get() {
        try {
            const chatbotURL = gateway?.chatBotURL;
            if (!chatbotURL) return;
            const response = await axios.get(`/schedule/${id}`, {baseURL: chatbotURL});
            return response.data ?? null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const {isLoading, data} = useQuery([id, 'schedule'], async () => get(), {enabled: !!id});

    return {
        loading: isLoading,
        data
    }
}

export function useSavePushSchedule(config: PushAnalytics, defaultValue?: any, onComplete?: () => void) {
    const {gateways} = useGateways();
    const queryClient = useQueryClient();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const gateway = useMemo(() => head(gateways), [gateways]);
    const {mutate, isLoading} = useMutation([config.id, 'schedule'], async (data: { cron: string }) => {
        if (defaultValue) {
            return update(defaultValue, [data.cron], {gateway: gateway?.chatBotURL as string})
        } else {
            return create({...config, crons: [data.cron]}, {gateway: gateway?.chatBotURL as string})
        }
    }, {
        onError: (error,) => {
            show({message: i18n.t("Error scheduling push"), type: {info: true}})
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: [config.id, 'schedule']});
            show({message: i18n.t("Schedule added successfully"), type: {success: true}});
            if (onComplete) {
                onComplete();
            }
        }
    });
    const {mutate: remove} = useMutation(['schedule', config.id], async (id: string) => {

    })

    const onAdd = useCallback(async (data: { cron: string }) => {
        return mutate(data);
    }, []);

    const onRemove = useCallback((id: string) => {

    }, [])

    return {
        saving: isLoading,
        onAdd
    }
}
