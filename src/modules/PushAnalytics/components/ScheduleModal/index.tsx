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
import {useManagePushSchedule, usePushJobData} from "./hooks/schedule";
import {useBoolean} from "usehooks-ts";
import {ScheduleFormModal} from "./components/ScheduleFormModal";
import CustomTable from "../../../../shared/components/CustomTable";
import {find, isEmpty} from "lodash";
import {getSchedule, stringToArray} from "cron-converter";
import {useConfirmDialog} from "@hisptz/dhis2-ui";
import {useSetting} from "@dhis2/app-service-datastore";

export interface ScheduleModalProps {
    onClose: () => void;
    hide: boolean;
    config: PushAnalytics;
}


export function ScheduleModal({onClose, hide, config}: ScheduleModalProps) {
    const [cronOptions] = useSetting("predefinedSchedules", {global: true})
    const {loading, data} = usePushJobData({
        jobId: config.id,
        gatewayId: config.gateway
    });
    const {confirm} = useConfirmDialog();
    const {value: hideAdd, setTrue: closeAdd, setFalse: openAdd} = useBoolean(true);
    const {onDelete} = useManagePushSchedule(config, data);


    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>{i18n.t("Schedules for {{name}}", {name: config.name})}</ModalTitle>
            <ModalContent>
                <ScheduleFormModal onClose={closeAdd} hide={hideAdd} config={config}/>
                {
                    loading ? (
                        <div style={{minHeight: 300}} className="column align-center center"><CircularLoader small/>
                        </div>) : (
                        <>
                            {
                                (!data || isEmpty(data.schedules)) ? (<div style={{minHeight: 200}}
                                                                           className="column align-center center gap-16">{i18n.t("Click on add schedule to start")}
                                        <Button onClick={openAdd} primary>{i18n.t("Add Schedule")}</Button></div>) :
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
                                                                 <Button
                                                                     onClick={() => {
                                                                         confirm({
                                                                             title: i18n.t("Confirm schedule delete"),
                                                                             message: i18n.t("Are you sure you want to delete this schedule?"),
                                                                             onConfirm: async () => {
                                                                                 await onDelete(schedule.id);
                                                                             },
                                                                             onCancel: () => {
                                                                             }
                                                                         })
                                                                     }}
                                                                     destructive
                                                                     icon={<IconDelete24/>}
                                                                 />
                                                             </ButtonStrip>
                                                         )
                                                     }))}

                                        />
                                    </div>
                            }
                        </>
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
