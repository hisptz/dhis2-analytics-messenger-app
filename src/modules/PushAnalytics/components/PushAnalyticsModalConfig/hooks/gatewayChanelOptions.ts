import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import { capitalize } from "lodash";
import { useGateways } from "../../../../Configuration/components/Gateways/components/GatewayConfigurationsTable/hooks/data";
import { RecipientData } from "../components/RecipientSelectorModal/RecipientSelectorModal";

export function useSelectedGateways() {
	const { data } = useGateways();
	const gateways = useWatch({
		name: "gateways",
		defaultValue: [],
	});

	return data.filter((gateway) => gateways.includes(gateway?.data.id));
}

export function useGatewayChannelOptions() {
	const selectedGateways = useSelectedGateways();
	return useMemo(
		() =>
			selectedGateways.map((gateway) => {
				return {
					label: capitalize(gateway!.data.get("name")),
					value: gateway!.data.id,
				};
			}),
		[selectedGateways],
	);
}

export function useSelectedRecipientGateway() {
	const [gateway] = useWatch<RecipientData>({
		name: ["gatewayId"],
	});

	const { data: selectedGateways } = useGateways();
	return selectedGateways?.find((gt) => gt!.data.id === gateway);
}
