import React, { useMemo } from "react";
import { useGateways } from "../../../../Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";
import { RHFMultiSelectField } from "../../../../../shared/components/Fields/RHFMultiSelectField";

export interface RHFGatewaySelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export function RHFGatewaySelector({
	validations,
	name,
	label,
	required,
}: RHFGatewaySelectorProps) {
	const { data, loading } = useGateways();

	const options = useMemo(() => {
		return (
			data?.map((value) => ({
				label: value?.data?.get("name"),
				value: value?.data?.id,
			})) ?? []
		);
	}, [data]);

	return (
		<RHFMultiSelectField
			loading={loading}
			required={required}
			validations={validations}
			label={label}
			options={options}
			name={name}
		/>
	);
}
