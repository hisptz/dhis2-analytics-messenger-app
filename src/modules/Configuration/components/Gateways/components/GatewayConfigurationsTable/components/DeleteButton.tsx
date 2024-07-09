import { Button, IconDelete24 } from "@dhis2/ui";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import Parse from "parse";
import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useConfirmDialog } from "@hisptz/dhis2-ui";
import { useRefetchGateways } from "../hooks/data";

export interface GatewayDeleteButtonProps {
	gateway: Parse.Object;
	channel: string;
}

export function GatewayDeleteButton({
	gateway,
	channel,
}: GatewayDeleteButtonProps) {
	const refetch = useRefetchGateways();
	const { confirm } = useConfirmDialog();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);
	const handleDelete = async () => {
		return await new Promise((resolve, reject) => {
			confirm({
				title: i18n.t("Confirm gateway deletion"),
				message: i18n.t("Are you sure you want to delete the gateway"),
				onConfirm: async () => {
					resolve(await gateway.destroy());
				},
				onCancel: () => {
					reject();
				},
			});
		});
	};

	const { mutate, isLoading } = useMutation({
		mutationKey: [channel, gateway.id],
		mutationFn: handleDelete,
		retry: false,
		onError: () => {
			show({
				message: i18n.t("Could not delete the gateway"),
				type: { critical: true },
			});
		},
		onSuccess: () => {
			show({
				message: i18n.t("Gateway deleted successfully"),
				type: { success: true },
			});
			refetch();
		},
	});

	return (
		<Button
			destructive
			loading={isLoading}
			onClick={() => mutate()}
			icon={<IconDelete24 />}
		/>
	);
}
