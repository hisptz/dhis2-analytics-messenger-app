import {
    Button,
    ButtonStrip,
    FlyoutMenu,
    MenuItem,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SplitButton
} from "@dhis2/ui"
import React, {useCallback, useEffect, useMemo} from "react"
import {Contact, PushAnalytics} from "../../../../shared/interfaces";
import {FormProvider, useForm} from "react-hook-form";
import i18n from '@dhis2/d2-i18n';
import {RHFTextInputField, useConfirmDialog} from "@hisptz/dhis2-ui";
import {RHFGatewaySelector} from "./components/RHFGatewaySelector";
import {RHFVisSelector} from "./components/RHFVisSelector";
import {RHFGroupSelector} from "./components/RHFGroupSelector";
import axios from "axios";
import {compact, find, isEmpty} from "lodash";
import {useSavedObject} from "@dhis2/app-service-datastore";
import {useBoolean} from "usehooks-ts";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {PUSH_ANALYTICS_DATASTORE_KEY} from "../../../../shared/constants/dataStore";
import {uid} from "@hisptz/dhis2-utils";
import {RHFDescription} from "./components/RHFDescription";
import {RHFRecipientSelector} from "./components/RHFRecipientSelector";
import {asyncify, mapSeries} from "async-es";
import {useResetRecoilState} from "recoil";
import {ConfigUpdateState} from "../PushAnalyticsTable";


export interface PushAnalyticsModalConfigProps {
    config?: PushAnalytics | null,
    hidden: boolean;
    onClose: () => void
}

async function getImage(visualizationId: string) {
    try {
        const response = await axios.get(`https://vmi368782.contaboserver.net/dev/visualizer/api/generate/${visualizationId}`)
        if (response.status === 200) {
            return response.data?.image;
        }
    } catch (e) {

    }
}

async function sendMessage(message: any, gateway: string) {

    try {
        const response = await axios.post(`${gateway}/send`, message,)
        if (response.status === 200) {
            return response.data;
        }
    } catch (e) {
        console.error(e)
        throw Error("Could not send message")
    }
}

export function useSendAnalytics() {
    const {value: loading, setTrue: startLoading, setFalse: endLoading} = useBoolean(false);
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}))

    const [gateways] = useSavedObject(`gateways`);


    async function getMessage(vis: { id: string; name: string }, {recipients, description}: {
        description: string;
        recipients: Contact[]
    }) {
        const visualization = await getImage(vis.id);
        if (visualization) {
            return {
                to: recipients,
                message: {
                    type: "image",
                    image: visualization,
                    text: description ?? "Push analytics from your DHIS2"
                }
            }
        }
    }

    const send = useCallback(
        async ({gateway, visualizations, contacts, description}: PushAnalytics) => {
            startLoading();
            const gatewayConf = find(gateways as any[], ['id', gateway]);
            if (!gatewayConf) {
                endLoading()
                return;
            }
            const url = gatewayConf.url;

            const messages = compact(await mapSeries(visualizations, asyncify(async (visualization: any) => await getMessage(visualization, {
                recipients: contacts,
                description: description ?? " "
            }))));

            if (isEmpty(messages)) {
                show({message: i18n.t("Could not send any visualizations to user"), type: {critical: true}});
                return;
            }

            const responses = await mapSeries(messages, asyncify(async (message: any) => await sendMessage(message, url)));

            console.log(responses);
            show({message: i18n.t("Messages successfully sent"), type: {success: true}})
            endLoading()
        },
        [],
    );


    return {
        send,
        loading
    }
}


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


function useSaveConfig(defaultConfig?: PushAnalytics | null) {
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

function SendActions({actions}: { actions: { label: string; action: () => void }[] }) {

    return (
        <FlyoutMenu>
            {
                actions.map(({label, action}) => (<MenuItem label={label} onClick={action}/>))
            }
        </FlyoutMenu>
    )
}


function getButtonLabel(creating: boolean, updating: boolean, sending: boolean, config?: PushAnalytics | null) {
    if (config) {
        if (updating) {
            return i18n.t("Updating")
        }
        if (sending) {
            return i18n.t("Sending...")
        }
        return i18n.t("Update and send")
    } else {
        if (creating) {
            return i18n.t("Saving...")
        }
        if (sending) {
            return i18n.t("Sending...")
        }
        return i18n.t("Save and send")
    }
}


export function PushAnalyticsModalConfig({config, hidden, onClose}: PushAnalyticsModalConfigProps) {
    const resetConfigUpdate = useResetRecoilState(ConfigUpdateState);
    const {confirm} = useConfirmDialog()
    const form = useForm<PushAnalytics>({
        defaultValues: config || {},
        shouldFocusError: false
    })
    const {send, loading: sending} = useSendAnalytics();
    const {save, creating, updating} = useSaveConfig(config);

    const onSaveAndSend = useCallback(
        async (data: PushAnalytics) => {
            await save(data);
            await send(data);
            onClose();
        },
        [send],
    );

    const onCloseClick = useCallback(
        () => {
            if (form.formState.isDirty) {
                confirm({
                    message: i18n.t("Are you sure you want to close the form? All changes will be lost."),
                    title: i18n.t("Confirm close"),
                    confirmButtonColor: "primary",
                    confirmButtonText: i18n.t("Close"),
                    onCancel: () => {
                    },
                    onConfirm: () => {
                        form.reset({});
                        onClose()
                    }
                })
            } else {
                form.reset({});
                onClose()
            }
        },
        [],
    );

    useEffect(() => {
        if (config) {
            form.reset(config)
        }
        return () => {
            form.reset({});
            resetConfigUpdate();
        }
    }, [config])

    const onSave = useCallback(
        async (data: PushAnalytics) => {
            await save(data);
            onClose()
        },
        [save],
    );

    return (
        <Modal position="middle" hide={hidden} onClose={onCloseClick}>
            <ModalTitle>
                {i18n.t("Send push analytics")}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField required validations={{required: i18n.t("Name is required")}} name="name"
                                           label={i18n.t("Name")}/>
                        <RHFGatewaySelector
                            required validations={{required: i18n.t("Gateway is required")}}
                            name="gateway"
                            label={i18n.t("Gateway")}
                        />

                        <RHFGroupSelector required validations={{required: i18n.t("Group is required")}}
                                          name="group"
                                          label={i18n.t("Visualization group")}/>
                        <RHFVisSelector required
                                        validations={{required: i18n.t("At least one visualization is required")}}
                                        name="visualizations"
                                        label={i18n.t("Visualizations")}/>
                        <RHFDescription label={i18n.t("Description")} name="description"/>
                        <RHFRecipientSelector label={i18n.t("Recipients")} name="contacts"/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>{i18n.t("Cancel")}</Button>
                    <SplitButton component={<SendActions actions={[
                        {
                            label: i18n.t("Save and send"),
                            action: form.handleSubmit(onSaveAndSend)
                        },
                        {
                            label: i18n.t("Save"),
                            action: form.handleSubmit(onSave)
                        }
                    ]}/>} loading={sending || creating || updating} onClick={form.handleSubmit(onSaveAndSend)}
                                 primary>{getButtonLabel(creating, updating, sending, config)}</SplitButton>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
