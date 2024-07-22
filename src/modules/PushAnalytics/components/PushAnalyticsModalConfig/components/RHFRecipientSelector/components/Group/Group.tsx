import React from "react";
import { useSelectedRecipientGateway } from "../../../../hooks/gatewayChanelOptions";
import { useGatewayGroups } from "../../../../../../../../shared/hooks/groups";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";

export interface GroupProps {
	gatewayType: "whatsapp" | "telegram";
}

export function Group() {
	const gateway = useSelectedRecipientGateway();
	const { data, isLoading, isError, error } = useGatewayGroups({
		gateway: gateway?.data,
	});

	const options =
		data?.map((datum: { name: string; id: string }) => ({
			label: datum.name,
			value: datum.id,
		})) ?? [];

	return (
		<RHFSingleSelectField
			label={i18n.t("Group")}
			warning={isError}
			validationText={(error as Parse.Error)?.message}
			disabled={!gateway}
			loading={isLoading}
			options={options}
			name={"identifier"}
		/>
	);
}
