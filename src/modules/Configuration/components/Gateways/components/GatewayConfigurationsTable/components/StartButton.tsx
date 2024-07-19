import { Button, IconSync24 } from "@dhis2/ui";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import Parse from "parse";
import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";

export interface GatewayConnectButtonProps {
	gateway: Parse.Object;
	channel: string;
	refetch: () => void;
}

export function GatewayStartButton({
	gateway,
	channel,
	refetch,
}: GatewayConnectButtonProps) {
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const handleConnect = async () => {
		const taskRun = {
			channel: channel.toLowerCase(),
			task: "start",
			session: gateway.get("sessionId"),
		};

		return (await Parse.Cloud.run("runChannelTask", taskRun)) ?? null;
	};

	const { mutate, isLoading } = useMutation({
		mutationKey: [channel, gateway.id],
		mutationFn: handleConnect,
		retry: false,
		onError: () => {
			show({
				message: i18n.t("Could not connect the gateway"),
				type: { critical: true },
			});
		},
		onSuccess: () => {
			show({
				message: i18n.t("Gateway connected successfully"),
				type: { success: true },
			});
			refetch();
		},
	});

	return (
		<Button
			loading={isLoading}
			onClick={() => mutate()}
			icon={<IconSync24 />}
		/>
	);
}
