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
import React, {useCallback, useEffect} from "react"
import {PushAnalytics} from "../../../../shared/interfaces";
import {FormProvider, useForm} from "react-hook-form";
import i18n from '@dhis2/d2-i18n';
import {RHFTextInputField, useConfirmDialog} from "@hisptz/dhis2-ui";
import {RHFGatewaySelector} from "./components/RHFGatewaySelector";
import {RHFVisSelector} from "./components/RHFVisSelector";
import {RHFGroupSelector} from "./components/RHFGroupSelector";
import {RHFDescription} from "./components/RHFDescription";
import {RHFRecipientSelector} from "./components/RHFRecipientSelector";
import {useRecoilValue, useResetRecoilState} from "recoil";
import {ConfigUpdateState} from "../PushAnalyticsTable";
import {useSendAnalytics} from "./hooks/send";
import {useSaveConfig} from "./hooks/save";


export interface PushAnalyticsModalConfigProps {
    config?: PushAnalytics | null,
    hidden: boolean;
    onClose: () => void
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
            return i18n.t("Updating...")
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

export function PushAnalyticsModalConfig({hidden, onClose}: PushAnalyticsModalConfigProps) {
    const config = useRecoilValue(ConfigUpdateState);
    const resetConfigUpdate = useResetRecoilState(ConfigUpdateState);
    const {confirm} = useConfirmDialog()
    const form = useForm<PushAnalytics>({
        defaultValues: config || {},
        shouldFocusError: false,
    })
    const {send, loading: sending} = useSendAnalytics();
    const {save, creating, updating} = useSaveConfig(config);

    const onSaveAndSend = useCallback(
        async (data: PushAnalytics) => {
            await save(data);
            await send(data);
            onCloseClick(true);
        },
        [send],
    );

    const onCloseClick = useCallback(
        (fromSave?: boolean) => {
            if (!fromSave && form.formState.isDirty) {
                confirm({
                    message: i18n.t("Are you sure you want to close the form? All changes will be lost."),
                    title: i18n.t("Confirm close"),
                    confirmButtonColor: "primary",
                    confirmButtonText: i18n.t("Close"),
                    onCancel: () => {
                    },
                    onConfirm: () => {
                        resetConfigUpdate();
                        form.reset({});
                        onClose()
                    }
                });
            } else {
                resetConfigUpdate();
                form.reset({});
                onClose()
            }
        },
        [onClose],
    );
    useEffect(() => {
        if (config) {
            form.reset(config)
        }

        return () => {
            form.reset({})
        }
    }, [config]);

    const onSave = useCallback(
        async (data: PushAnalytics) => {
            await save(data);
            onCloseClick(true)
        },
        [save],
    );

    return (
        <Modal large position="middle" hide={hidden} onClose={onCloseClick}>
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
                            label: config ? i18n.t("Update and send") : i18n.t("Save and send"),
                            action: form.handleSubmit(onSaveAndSend)
                        },
                        {
                            label: config ? i18n.t("Update") : i18n.t("Save"),
                            action: form.handleSubmit(onSave)
                        }
                    ]}/>} loading={sending || creating || updating} onClick={form.handleSubmit(onSaveAndSend)}
                                 primary>{getButtonLabel(creating, updating, sending, config)}</SplitButton>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
