import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Parse from "parse";
import { PushAnalyticsJobSchedule } from "../../../../../shared/interfaces";
import { uniqBy } from "lodash";

export interface PushSchedule {
	cron: string;
	enabled: boolean;
	id?: string;
	job?: {
		id: string;
	};
}

export function useManagePushSchedule(
	config: Parse.Object,
	defaultValue?: PushAnalyticsJobSchedule,
	onComplete?: () => void,
) {
	const queryClient = useQueryClient();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const { mutateAsync: onAdd, isLoading } = useMutation(
		[config.id, "schedule"],
		async (data: { cron: string; enabled: boolean }) => {
			const schedules = uniqBy(
				[...(config.get("schedules") ?? []), data],
				"cron",
			);
			config.set("schedules", schedules);
			return await config.save();
		},
		{
			onError: (error: any) => {
				show({
					message: `${i18n.t("Error scheduling push")}: ${
						error.message
					}`,
					type: { info: true },
				});
			},
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: [config.id] });
				if (defaultValue) {
					show({
						message: i18n.t("Schedule updated successfully"),
						type: { success: true },
					});
				} else {
					show({
						message: i18n.t("Schedule added successfully"),
						type: { success: true },
					});
				}
				if (onComplete) {
					onComplete();
				}
			},
		},
	);
	const { mutateAsync: onDelete } = useMutation(
		[config.id],
		async (data: PushAnalyticsJobSchedule) => {
			const updatedSchedules = config
				.get("schedules")
				?.filter(
					(schedule: PushAnalyticsJobSchedule) =>
						schedule.cron !== data.cron,
				);
			config.set("schedules", updatedSchedules);
			return await config.save();
		},
		{
			onError: (error: any) => {
				show({
					message: `${i18n.t("Error scheduling push")}: ${
						error.message
					}`,
					type: { info: true },
				});
			},
			onSuccess: async () => {
				show({
					message: i18n.t("Schedule deleted successfully"),
					type: { success: true },
				});
			},
		},
	);

	return {
		saving: isLoading,
		onAdd,
		onDelete,
	};
}
