import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, SegmentedControl} from "@dhis2/ui";
import {FormProvider, useForm} from "react-hook-form";
import React, {useState} from "react";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {PushSchedule, useManagePushSchedule} from "../hooks/schedule";


export interface ScheduleFormModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics,
    defaultValue?: PushSchedule;
}

export const cronOptions = [
    {
        label: i18n.t("Every 2 minutes"),
        value: "*/2 * * * *"
    },
    {
        label: i18n.t("Every 5 minutes"),
        value: "*/5 * * * *"
    },
    {
        label: i18n.t("Every 10 minutes"),
        value: "*/10 * * * *"
    },
    {
        label: i18n.t("Every hour"),
        value: "0 * * * *"
    },
    {
        label: i18n.t("Every day at midnight"),
        value: "0 0 * * *"
    },
    {
        label: i18n.t("Every day at noon"),
        value: "0 12 * * *"
    },
    {
        label: i18n.t("Every week on Monday"),
        value: "0 0 * * 1"
    }
]

function Predefined() {

    return (
        <RHFSingleSelectField label={i18n.t("Select time")} options={cronOptions} name={"cron"}/>
    )

}

export function ScheduleFormModal({onClose, hide, config, defaultValue}: ScheduleFormModalProps) {
    const form = useForm<{ cron: string }>();
    const [type, setType] = useState('predefined');
    const {onAdd, saving} = useManagePushSchedule(config, defaultValue, onClose);
    const onSubmit = (data: { cron: string }) => onAdd(data);

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>{i18n.t("Add new schedule")}</ModalTitle>
            <ModalContent>
                <FormProvider {...form} >
                    <div style={{minHeight: 200}} className="column gap-16">
                        {i18n.t("Scheduling to send")}<b>{config.name}</b>
                        <SegmentedControl
                            selected={type}
                            onChange={({value}: { value: string }) => setType(value)}
                            options={[
                                {label: i18n.t("Predefined"), value: "predefined"},
                                {label: i18n.t("Custom"), value: "custom"},
                            ]}
                        />

                        {
                            type === 'predefined' && <Predefined/>
                        }
                        {
                            type === 'custom' && <div>{i18n.t("Custom support is on the way!")}</div>
                        }
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} loading={saving}
                            primary>{saving ? i18n.t("Adding...") : i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
