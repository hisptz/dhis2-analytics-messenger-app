import { useDamConfig } from "../../../../../../../shared/components/DamConfigProvider";
import { QueryKey, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import Parse from "parse";
import { channels } from "../../../constants/channels";

function getClients({ clientClassName }: { clientClassName: string }) {
	return async ({ queryKey }: { queryKey: QueryKey }) => {
		const [dhis2Instance] = queryKey;
		const query = new Parse.Query(clientClassName);
		query.equalTo("dhis2Instance", dhis2Instance);
		return query.find();
	};
}

export function useGateways() {
	const damConfig = useDamConfig();
	const results = useQueries({
		queries: channels.map(({ className }) => ({
			queryKey: [damConfig],
			queryFn: getClients({
				clientClassName: className,
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
