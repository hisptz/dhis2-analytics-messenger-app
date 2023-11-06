import {
	Button,
	ButtonStrip,
	IconDelete24,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import React from "react";
import i18n from "@dhis2/d2-i18n";
import { useManagePushSchedule } from "./hooks/schedule";
import { useBoolean } from "usehooks-ts";
import { ScheduleFormModal } from "./components/ScheduleFormModal";
import CustomTable from "../../../../shared/components/CustomTable";
import { isEmpty } from "lodash";
import { getSchedule, stringToArray } from "cron-converter";
import { useConfirmDialog } from "@hisptz/dhis2-ui";
import cronstrue from "cronstrue";

import Parse from "parse";
import { PushAnalyticsJobSchedule } from "../../../../shared/interfaces";

export interface ScheduleModalProps {
	onClose: () => void;
	hide: boolean;
	config: Parse.Object;
}

function getCronName(cron: string) {
	try {
		return cronstrue.toString(cron);
	} catch (e) {
		return cron;
	}
}

function getNextRun(cron: string) {
	try {
		return getSchedule(stringToArray(cron))
			.next()
			.toFormat("yyyy-MM-dd HH:mm");
	} catch (e) {
		return "";
	}
}

export function ScheduleModal({ onClose, hide, config }: ScheduleModalProps) {
	const schedules = config.get("schedules") ?? [];
	const { confirm } = useConfirmDialog();
	const {
		value: hideAdd,
		setTrue: closeAdd,
		setFalse: openAdd,
	} = useBoolean(true);
	const { onDelete } = useManagePushSchedule(config);

	return (
		<Modal position="middle" hide={hide} onClose={onClose}>
			<ModalTitle>
				{i18n.t("Schedules for {{name}}", { name: config.get("name") })}
			</ModalTitle>
			<ModalContent>
				<ScheduleFormModal
					onClose={closeAdd}
					hide={hideAdd}
					config={config}
				/>
				<>
					{isEmpty(schedules) ? (
						<div
							style={{ minHeight: 200 }}
							className="column align-center center gap-16"
						>
							{i18n.t("Click on add schedule to start")}
							<Button onClick={openAdd} primary>
								{i18n.t("Add Schedule")}
							</Button>
						</div>
					) : (
						<div className="column gap-16 ">
							<div className="row end">
								<Button onClick={openAdd} primary>
									{i18n.t("Add Schedule")}
								</Button>
							</div>
							<CustomTable
								columns={[
									{
										key: "cron",
										label: i18n.t("When"),
									},
									{
										key: "nextRun",
										label: i18n.t("Next run"),
									},
									{
										key: "actions",
										label: i18n.t("Actions"),
									},
								]}
								data={schedules.map(
									(schedule: PushAnalyticsJobSchedule) => ({
										cron: getCronName(schedule.cron),
										nextRun: getNextRun(schedule.cron),
										actions: (
											<ButtonStrip>
												<Button
													onClick={() => {
														confirm({
															title: i18n.t(
																"Confirm schedule delete",
															),
															message: i18n.t(
																"Are you sure you want to delete this schedule?",
															),
															onConfirm:
																async () => {
																	await onDelete(
																		schedule,
																	);
																},
															onCancel: () => {},
														});
													}}
													icon={<IconDelete24 />}
												/>
											</ButtonStrip>
										),
									}),
								)}
							/>
						</div>
					)}
				</>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Close")}</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
