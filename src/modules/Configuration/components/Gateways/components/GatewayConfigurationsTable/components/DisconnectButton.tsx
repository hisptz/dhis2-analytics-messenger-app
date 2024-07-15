import { Button, IconCross24 } from "@dhis2/ui";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import Parse from "parse";
import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";

export interface GatewayDisconnectButtonProps {
	gateway: Parse.Object;
	channel: string;
	refetch: () => void;
}

export function GatewayDisconnectButton({
	gateway,
	channel,
	refetch,
}: GatewayDisconnectButtonProps) {
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const handleDisconnect = async () => {
		const taskRun = {
			channel: channel.toLowerCase(),
			task: "stop",
			session: gateway.get("sessionId"),
		};
		return (await Parse.Cloud.run("runChannelTask", taskRun)) ?? null;
	};

	const { mutate, isLoading } = useMutation({
		mutationKey: [channel, gateway.id],
		mutationFn: handleDisconnect,
		retry: false,
		onError: () => {
			show({
				message: i18n.t("Could not disconnect the gateway"),
				type: { critical: true },
			});
		},
		onSuccess: () => {
			show({
				message: i18n.t("Gateway disconnected successfully"),
				type: { success: true },
			});
			refetch();
		},
	});

	return (
		<Button
			loading={isLoading}
			onClick={() => mutate()}
			icon={<IconCross24 />}
		/>
	);
}
