import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui"
import React, {useCallback} from "react"
import {PushAnalytics} from "../../../../shared/interfaces";
import {FormProvider, useForm} from "react-hook-form";
import i18n from '@dhis2/d2-i18n';
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import {RHFGatewaySelector} from "./components/RHFGatewaySelector";
import {RHFVisSelector} from "./components/RHFVisSelector";
import {RHFGroupSelector} from "./components/RHFGroupSelector";
import axios from "axios";
import {find} from "lodash";
import {useSavedObject} from "@dhis2/app-service-datastore";
import {useBoolean} from "usehooks-ts";
import {useAlert} from "@dhis2/app-runtime";


export interface PushAnalyticsModalConfigProps {
    config?: PushAnalytics,
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
    console.log(message)


    try {
        const response = await axios.post(`${gateway}/send`, message,)
        if (response.status === 200) {
            return response.data;
        }
    } catch (e) {
        console.error(e)
    }
}

function useSendAnalytics() {
    const {value: loading, setTrue: startLoading, setFalse: endLoading} = useBoolean(false);
    const {show} = useAlert(({message}: { message: string }) => message, ({type}: any) => ({...type, duration: 3000}))

    const [gateways] = useSavedObject(`gateways`);

    const send = useCallback(
        async ({gateway, visualizations: visualizationId, recipients, description}: any) => {
            startLoading();
            const gatewayConf = find(gateways as any[], ['id', gateway]);
            if (!gatewayConf) {
                endLoading()
                return;
            }
            const visualization = await getImage(visualizationId);
            if (visualization) {
                const message = {
                    to: [{
                        type: "individual",
                        number: recipients
                    }],
                    message: {
                        type: "image",
                        image: visualization,
                        text: description ?? "Push analytics from your DHIS2"
                    }
                }
                await sendMessage(message, gatewayConf.url);
                show({message: i18n.t("Analytics sent successfully"), type: {success: true}});
                endLoading();
            }
        },
        [],
    );


    return {
        send,
        loading
    }
}

export function PushAnalyticsModalConfig({config, hidden, onClose}: PushAnalyticsModalConfigProps) {
    const form = useForm<PushAnalytics>({
        defaultValues: config,
        shouldFocusError: false
    })

    const {send, loading} = useSendAnalytics();

    const onSubmit = useCallback(
        (data: any) => {
            send(data)
        },
        [send],
    );


    return (
        <Modal position="middle" hide={hidden} onClose={onClose}>
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
                        <RHFTextInputField label={i18n.t("Description")} name="description"/>
                        <RHFTextInputField label={i18n.t("Recipient")} name={"recipients"}/>
                        {/*<RHFRecipientSelector label={i18n.t("Recipients")} name="recipients"/>*/}
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button>{i18n.t("Cancel")}</Button>
                    <Button loading={loading} onClick={form.handleSubmit(onSubmit)}
                            primary>{loading ? i18n.t("Sending...") : i18n.t("Send")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
