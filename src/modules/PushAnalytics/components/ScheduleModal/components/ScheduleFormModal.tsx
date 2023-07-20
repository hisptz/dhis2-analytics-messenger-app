import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle, SegmentedControl} from "@dhis2/ui";
import {FormProvider, useForm} from "react-hook-form";
import React, {useState} from "react";
import {PushAnalytics} from "../../../../../shared/interfaces";
import {PushSchedule, useManagePushSchedule} from "../hooks/schedule";
import {PredefinedSelector} from "./PredefinedSelector";
import {CustomCronInput} from "./CustomCronInput";


export interface ScheduleFormModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics,
    defaultValue?: PushSchedule;
}


export function ScheduleFormModal({onClose, hide, config, defaultValue}: ScheduleFormModalProps) {
    const form = useForm<{ cron: string }>();
    const [type, setType] = useState('predefined');
    const {onAdd, saving} = useManagePushSchedule(config, defaultValue, onClose);
    const onSubmit = (data: { cron: string }) => onAdd(data);

    const onCloseClick = () => {
        form.reset();
        onClose()
    }

    return (
        <Modal position="middle" hide={hide} onClose={onCloseClick}>
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
                            type === 'predefined' && <PredefinedSelector/>
                        }
                        {
                            type === 'custom' && <CustomCronInput/>
                        }
                    </div>
                </FormProvider>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCloseClick}>Cancel</Button>
                    <Button onClick={form.handleSubmit(onSubmit)} loading={saving}
                            primary>{saving ? i18n.t("Adding...") : i18n.t("Add")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
