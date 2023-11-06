import i18n from "@dhis2/d2-i18n";
import {
	IconClockHistory24,
	IconDelete24,
	IconEdit24,
	IconMessages24,
} from "@dhis2/ui";
import { ContactName } from "../../../../../shared/components/ContactChip";
import { ActionButton } from "../../../../../shared/components/CustomDataTable/components/ActionButton";
import React from "react";
import { useBoolean } from "usehooks-ts";
import { PushAnalyticsModalConfig } from "../../PushAnalyticsModalConfig";
import { useConfirmDialog } from "@hisptz/dhis2-ui";
import { Contact } from "../../../../../shared/interfaces";
import { useManageConfig } from "../../PushAnalyticsModalConfig/hooks/save";
import { useQueryClient } from "@tanstack/react-query";
import { ScheduleModal } from "../../ScheduleModal";

export interface JobActionAreaProps {
	config: Parse.Object;
}

export function JobActionArea({ config }: JobActionAreaProps) {
	const {
		value: hideEdit,
		setTrue: onHideEdit,
		setFalse: onShowEdit,
	} = useBoolean(true);
	const {
		value: hideSchedule,
		setTrue: onHideSchedule,
		setFalse: onShowSchedule,
	} = useBoolean(true);
	const { confirm } = useConfirmDialog();
	const queryClient = useQueryClient();

	const { deleteConfig } = useManageConfig({
		defaultConfig: config,
		onComplete: () => {
			queryClient.invalidateQueries(["analyticsJobs"]);
		},
	});

	return (
		<>
			{!hideEdit && (
				<PushAnalyticsModalConfig
					key={config.id}
					config={config}
					hidden={hideEdit}
					onClose={onHideEdit}
				/>
			)}
			{!hideSchedule && (
				<ScheduleModal
					onClose={onHideSchedule}
					hide={hideSchedule}
					config={config}
				/>
			)}
			<ActionButton
				actions={[
					{
						key: "edit-config",
						label: i18n.t("Edit"),
						icon: <IconEdit24 />,
						onClick: onShowEdit,
					},
					{
						key: "edit-config",
						label: i18n.t("Schedule"),
						icon: <IconClockHistory24 />,
						onClick: onShowSchedule,
					},
					{
						key: "delete-config",
						label: i18n.t("Delete"),
						icon: <IconDelete24 />,
						onClick: () => {
							confirm({
								loadingText: i18n.t("Deleting..."),
								confirmButtonText: i18n.t("Delete"),
								title: i18n.t("Confirm delete"),
								message: i18n.t(
									"Are you sure you want to delete the configuration {{name}}?",
									{
										name: config.get("name"),
									},
								),
								onCancel: () => {},
								onConfirm: async () => {
									await deleteConfig(config);
								},
							});
						},
					},
					{
						key: "send-messages",
						label: i18n.t("Send"),
						icon: <IconMessages24 />,
						onClick: () => {
							confirm({
								confirmButtonColor: "primary",
								loadingText: i18n.t("Sending..."),
								confirmButtonText: i18n.t("Send"),
								title: i18n.t("Confirm sending"),
								message: (
									<>
										{i18n.t("Sending visualizations to")}:
										<ul>
											{config
												.get("contacts")
												?.map((contact: Contact) => (
													<li
														key={`${contact.identifier}-list`}
													>
														<ContactName
															{...contact}
														/>
													</li>
												))}
										</ul>
									</>
								),
								onCancel: () => {},
								onConfirm: async () => {},
							});
						},
					},
				]}
				row={config}
			/>
		</>
	);
}
