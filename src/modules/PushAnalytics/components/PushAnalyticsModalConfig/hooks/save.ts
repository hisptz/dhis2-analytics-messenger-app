import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { PushAnalyticsJobFormData } from "../../../../../shared/interfaces";
import Parse from "parse";
import { useDamConfig } from "../../../../../shared/components/DamConfigProvider";
import { ParseClass } from "../../../../../shared/constants/parse";
import { useGateways } from "../../../../Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";

export function useManageConfig({
	onComplete,
	defaultConfig,
}: {
	onComplete: (job?: Parse.Object) => void;
	defaultConfig?: Parse.Object | null;
}) {
	const dhis2Instance = useDamConfig();

	const { data: allGateways } = useGateways();

	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const { mutateAsync: manageJob, isLoading } = useMutation(
		["job", defaultConfig],
		async (data: PushAnalyticsJobFormData) => {
			const gateways = data.gateways
				.map((gatewayId) =>
					allGateways.find(
						(gateway) => gateway?.data.id === gatewayId,
					),
				)
				.filter((gateway) => gateway !== undefined);
			if (defaultConfig) {
				return await defaultConfig.save({
					...data,
					gateways,
					dhis2Instance,
				});
			} else {
				const newJob = new Parse.Object(ParseClass.ANALYTICS_PUSH_JOB);
				const createdObject = await newJob.save({
					...data,
					gateways,
					dhis2Instance,
					schedules: [],
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
					type: { critical: true },
				});
			},
			onSuccess: (job) => {
				if (defaultConfig) {
					show({
						message: i18n.t("Configuration updated successfully"),
						type: { success: true },
					});
					onComplete(job);
				} else {
					show({
						message: i18n.t("Configuration saved successfully"),
						type: { success: true },
					});
				}
				onComplete(job);
			},
		},
	);

	const { mutateAsync: deleteConfig, isLoading: deleting } = useMutation({
		mutationKey: [defaultConfig?.id],
		mutationFn: async (config: Parse.Object) => {
			if (config) {
				return await config.destroy();
			}
		},
		onError: (error: any) => {
			show({
				message: `${i18n.t("Error saving configuration")}: ${
					error.message
				}`,
				type: { critical: true },
			});
		},
		onSuccess: () => {
			show({
				message: i18n.t("Configuration deleted successfully"),
				type: { success: true },
			});
			onComplete();
		},
	});

	const save = useCallback(
		async (data: PushAnalyticsJobFormData): Promise<Parse.Object> => {
			return manageJob(data);
		},
		[manageJob],
	);

	return {
		isLoading,
		deleteConfig,
		deleting,
		save,
	};
}
