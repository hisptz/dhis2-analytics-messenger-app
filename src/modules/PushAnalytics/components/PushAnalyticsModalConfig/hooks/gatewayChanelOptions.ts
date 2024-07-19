import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import { capitalize, lowerCase } from "lodash";
import { useGateways } from "../../../../Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";

export function useGatewayChannelOptions() {
	const { data } = useGateways();
	const gateways = useWatch({
		name: "gateways",
		defaultValue: [],
	});

	return useMemo(
		() =>
			gateways.map((gateway: string) => {
				const { channel } =
					data.find((gt) => gt?.data.id === gateway) ?? {};
				return {
					label: capitalize(channel),
					value: lowerCase(channel),
				};
			}),
		[gateways, data],
	);
}
