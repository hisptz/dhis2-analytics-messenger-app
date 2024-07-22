import { useAlert } from "@dhis2/app-runtime";
import { useMutation } from "@tanstack/react-query";
import Parse from "parse";
import i18n from "@dhis2/d2-i18n";

export function useSendAnalytics() {
	const { show } = useAlert(
		({ message }: { message: string }) => message,
		({ type }: any) => ({
			...type,
			duration: 3000,
		}),
	);
	const { mutateAsync: send, isLoading } = useMutation([], {
		mutationFn: async (config: Parse.Object) => {
			return await Parse.Cloud.run("runAnalyticsPushJob", {
				jobId: config.id,
				trigger: "MANUAL",
			});
		},
		onError: (error: any) => {
			show({
				message: `${i18n.t("Error sending push")}: ${error.message}`,
				type: { critical: true },
			});
		},
		onSuccess: () => {
			show({
				message: i18n.t("Push request sent successfully."),
				type: { success: true },
			});
			return;
		},
	});

	return {
		send,
		loading: isLoading,
	};
}
