import React, {useCallback} from "react"
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {FormProvider, useForm} from "react-hook-form";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import {useSaveGateway} from "./hooks/save";


export interface GatewayConfig {
    id: string;
    name: string;
    url: string;
}

export interface GatewayConfigurationModalProps {
    onClose: () => void,
    config?: GatewayConfig;
    hidden: boolean;
}

export function GatewayConfigurationModal({onClose, config, hidden}: GatewayConfigurationModalProps) {
    const form = useForm<GatewayConfig>({
        defaultValues: config
    });
    const {save} = useSaveGateway();

    const onSubmit = useCallback(
        async (data: GatewayConfig) => {
            await save(data);
            onClose()
        },
        [],
    );


    return (
        <Modal position="middle" hide={hidden} onClose={onClose}>
            <ModalTitle>
                {i18n.t("{{operation}} gateway", {
                    operation: config ? i18n.t("Update") : i18n.t("Add")
                })}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField label={i18n.t("Name")} name="name" required
                                           validations={{required: i18n.t("Name is required")}}/>
                        <RHFTextInputField label={i18n.t("URL")} type="url" name="url" required
                                           validations={{required: i18n.t("URL is required")}}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button onClick={form.handleSubmit(onSubmit)}
                            primary>{config ? i18n.t("Update") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
