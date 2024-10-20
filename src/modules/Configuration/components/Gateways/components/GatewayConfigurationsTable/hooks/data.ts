import { useDamConfig } from "../../../../../../../shared/components/DamConfigProvider";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import Parse from "parse";
import { channels } from "../../../../../../../shared/constants/channels";
import { forEach } from "async";

function getClients({
	clientClassName,
	dhis2Instance,
}: {
	clientClassName: string;
	dhis2Instance: Parse.Object;
}) {
	return async () => {
		const query = new Parse.Query(clientClassName);
		query.equalTo("dhis2Instance", dhis2Instance);
		query.ascending("name");
		return query.find();
	};
}

export function useGateways() {
	const damConfig = useDamConfig();
	const results = useQueries({
		queries: channels.map(({ className }) => ({
			queryKey: [className],
			queryFn: getClients({
				clientClassName: className,
				dhis2Instance: damConfig!,
			}),
		})),
	});
	return useMemo(() => {
		return {
			data: results
				.map((clientResults, index) => {
					return clientResults.data?.map((data) => ({
						data,
						channel: channels[index].name,
					}));
				})
				.flat()
				.filter((data) => data !== null),
			loading: results.reduce(
				(acc, { isLoading }) => acc || isLoading,
				false,
			),
			error: results
				.map(({ error }) => error)
				.filter((error) => error !== null) as Error[],
		};
	}, [results]);
}

export function useRefetchGateways() {
	const queryClient = useQueryClient();
	return async () => {
		await forEach(channels, async ({ className }) => {
			await queryClient.refetchQueries({
				queryKey: [className],
			});
		});
	};
}
