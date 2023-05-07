import React, {useCallback} from "react"
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {FormProvider, useForm} from "react-hook-form";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import {useSaveVisualizationGroup} from "./hooks/save";
import {RHFVisualizationSelector} from "./Components/RHFVisualizationSelector";
import {isEmpty} from "lodash";


export interface VisualizationGroupConfig {
    id: string;
    name: string;
    visualizations: {
        id: string;
        name: string
    }[]
}

export interface VisualizationGroupsModalProps {
    onClose: () => void,
    config?: VisualizationGroupConfig;
    hidden: boolean;
}

export function VisualizationGroupsModal({onClose, config, hidden}: VisualizationGroupsModalProps) {
    const form = useForm<VisualizationGroupConfig>({
        defaultValues: config,
        shouldFocusError: false
    });
    const {save, updating, creating} = useSaveVisualizationGroup(config);

    const onSubmit = useCallback(
        async (data: VisualizationGroupConfig) => {
            await save(data);
            onClose()
        },
        [],
    );

    return (
        <Modal position="middle" hide={hidden} onClose={onClose}>
            <ModalTitle>
                {i18n.t("{{operation}} group", {
                    operation: config ? i18n.t("Update") : i18n.t("Add")
                })}
            </ModalTitle>
            <ModalContent>
                <FormProvider {...form}>
                    <div className="column gap-16">
                        <RHFTextInputField label={i18n.t("Name")} name="name" required
                                           validations={{required: i18n.t("Name is required")}}/>
                        <RHFVisualizationSelector
                            required
                            name={'visualizations'}
                            validations={{
                                validate: (value: string[]) => {
                                    console.log(value)
                                    return !isEmpty(value) || i18n.t("Select at least one visualization")
                                }
                            }}
                            label={i18n.t("Visualizations")}/>
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
                    <Button loading={creating || updating} onClick={form.handleSubmit(onSubmit)}
                            primary>{config ? updating ? i18n.t("Updating...") : i18n.t("Update") : creating ? i18n.t("Saving...") : i18n.t("Save")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
