import {useGateways} from "../../../../Configuration/components/Gateway/hooks/data";
import {useMemo} from "react";
import {head} from "lodash";
import axios from "axios";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PushAnalytics} from "../../../../../shared/interfaces";
import i18n from '@dhis2/d2-i18n';
import {useAlert} from "@dhis2/app-runtime";
import {uid} from "@hisptz/dhis2-utils";


export interface PushSchedule {
    cron: string;
    enabled: boolean;
    id?: string
    job?: {
        id: string
    }
}


function formatData(data: PushSchedule) {
    return {
        ...data,
        id: data.id ?? uid()
    }
}

async function create(data: PushSchedule, {gateway}: { gateway: string }) {
    const payload = formatData(data);
    try {
        const response = await axios.post(`/schedules`, payload, {
            baseURL: gateway
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function remove(id: string, {gateway}: { gateway: string }) {
    try {
        const response = await axios.delete(`/schedules/${id}`, {
            baseURL: gateway
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function update(updatedValue: PushSchedule, {gateway}: {
    gateway: string
}) {
    try {
        const response = await axios.put(`/schedules/${updatedValue.id}`, {
            ...updatedValue,
        }, {
            baseURL: gateway
        });
        return response.data ?? null;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function usePushJobSchedules(id: string) {
    const {gateways} = useGateways();
    const gateway = useMemo(() => head(gateways), [gateways]);

    async function get() {
        try {
            const chatbotURL = gateway?.chatBotURL;
            if (!chatbotURL) return;
            const response = await axios.get(`/jobs/${id}`, {baseURL: chatbotURL});
            return response.data ?? null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const {isLoading, data} = useQuery([id, 'job'], async () => get(), {enabled: !!id});

    return {
        loading: isLoading,
        data
    }
}

export function useManagePushSchedule(config: PushAnalytics, defaultValue?: any, onComplete?: () => void) {
    const {gateways} = useGateways();
    const queryClient = useQueryClient();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const gateway = useMemo(() => head(gateways), [gateways]);
    const {mutate: onAdd, isLoading} = useMutation([config.id, 'schedule'], async (data: { cron: string }) => {
        const chatbotGateway = gateway?.chatBotURL as string;
        if (defaultValue) {
            return update({
                ...defaultValue,
                ...data
            }, {gateway: chatbotGateway})
        } else {
            return create({
                ...data,
                enabled: true,
                job: {
                    id: config.id
                }
            }, {gateway: chatbotGateway})
        }
    }, {
        onError: (error: any) => {
            show({message: `${i18n.t("Error scheduling push")}: ${error.message}`, type: {info: true}})
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [config.id, 'job']});
            if (defaultValue) {
                show({message: i18n.t("Schedule updated successfully"), type: {success: true}});
            } else {
                show({message: i18n.t("Schedule added successfully"), type: {success: true}});
            }
            if (onComplete) {
                onComplete();
            }
        }
    });
    const {mutate: onDelete} = useMutation(['schedule', config.id], async (id: string) => {
        const chatbotGateway = gateway?.chatBotURL as string;
        return remove(id, {gateway: chatbotGateway})
    });

    return {
        saving: isLoading,
        onAdd,
        onDelete
    }
}
