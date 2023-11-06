import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { PushAnalyticsJobFormData } from "../../../../../shared/interfaces";
import Parse from "parse";

export function useManageConfig({
	onComplete,
	defaultConfig,
}: {
	onComplete: (job: Parse.Object) => void;
	defaultConfig?: Parse.Object | null;
}) {
	const currentUser = Parse.User.current();
	const instanceId =
		currentUser?.attributes.authDataResponse.dhis2Auth.instance.objectId;

	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 },
	);
	const { mutateAsync: manageJob, isLoading } = useMutation(
		["job", defaultConfig],
		async (data: PushAnalyticsJobFormData) => {
			if (defaultConfig) {
				return await defaultConfig.save({
					...dat,
				});
			} else {
				const newJob = new Parse.Object("AnalyticsPushJob");
				const createdObject = await newJob.save({
					...data,
					dhis2Instance: {
						__type: "Pointer",
						className: "DHIS2Instance",
						objectId: instanceI,
					,
				});

				return await createdObject.fetch();
			}
		},
		{
			onError: (error: any) => {
				show({
					message: `${i18n.t("Error saving configuration")}: ${
						error.message
					}`,
					type: { critical: true ,
				});
			},
			onSuccess: (job) => {
				if (defaultConfig) {
					show({
						message: i18n.t("Configuration updated successfully"),
						type: { success: true ,
					});
				} else {
					show({
						message: i18n.t("Configuration saved successfully"),
						type: { success: true ,
					});
				}
				onComplete(job);
			,
		,
	);

	const save = useCallback(
		async (data: PushAnalyticsJobFormData): Promise<Parse.Object> => {
			return manageJob(data);
		},
		[manageJob]
	);

	return {
		isLoading,
		deleteConfig: () => {},
		save
	};
}
