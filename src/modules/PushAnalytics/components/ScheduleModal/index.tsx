import {
    Button,
    ButtonStrip,
    CircularLoader,
    IconDelete24,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle
} from "@dhis2/ui"
import React from "react"
import i18n from '@dhis2/d2-i18n';
import {PushAnalytics} from "../../../../shared/interfaces";
import {usePushSchedule, useSavePushSchedule} from "./hooks/schedule";
import {useBoolean} from "usehooks-ts";
import {cronOptions, ScheduleFormModal} from "./components/ScheduleFormModal";
import CustomTable from "../../../../shared/components/CustomTable";
import {find} from "lodash";
import {getSchedule, stringToArray} from "cron-converter";

export interface ScheduleModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics;
}


export function ScheduleModal({onClose, hide, config}: ScheduleModalProps) {
    const {loading, data} = usePushSchedule(config.id as string);
    const {value: hideAdd, setTrue: closeAdd, setFalse: openAdd} = useBoolean(true);
    const {} = useSavePushSchedule(config, data);

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>{i18n.t("Schedules for {{name}}", {name: config.name})}</ModalTitle>
            <ModalContent>
                <ScheduleFormModal defaultValue={data} onClose={closeAdd} hide={hideAdd} config={config}/>
                {
                    loading && (
                        <div style={{minHeight: 300}} className="column align-center center"><CircularLoader small/></div>)
                }
                {
                    (!data && !loading) ? (<div style={{minHeight: 300}}
                                                className="column align-center center gap-16">{i18n.t("Click on add schedule to start")}
                        <Button onClick={openAdd} primary>{i18n.t("Add Schedule")}</Button></div>) : null
                }
                {
                    data && (
                        <div className="column gap-16 ">
                            <div className="row end">
                                <Button onClick={openAdd} primary>{i18n.t("Add Schedule")}</Button>
                            </div>
                            <CustomTable columns={[
                                {
                                    key: "cron",
                                    label: i18n.t("When")
                                },
                                {
                                    key: "nextRun",
                                    label: i18n.t("Next run")
                                },
                                {
                                    key: "actions",
                                    label: i18n.t("Actions")
                                }
                            ]}
                                         data={data.schedules.map((schedule: any) => ({
                                             cron: find(cronOptions, ['value', schedule.cron])?.label,
                                             nextRun: getSchedule(stringToArray(schedule.cron)).next().toFormat('yyyy-MM-dd HH:mm'),
                                             actions: (
                                                 <ButtonStrip>
                                                     <Button icon={<IconDelete24/>}/>
                                                 </ButtonStrip>
                                             )
                                         }))}

                            />
                        </div>
                    )
                }

            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t("Close")}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
