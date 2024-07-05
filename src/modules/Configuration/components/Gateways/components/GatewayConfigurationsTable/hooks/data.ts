import { useDamConfig } from "../../../../../../../shared/components/DamConfigProvider";
import { QueryKey, useQueries } from "@tanstack/react-query";
import { ParseClass } from "../../../../../../../shared/constants/parse";
import { useMemo } from "react";

function getClients({ clientClassName }: { clientClassName: string }) {
	return async ({ queryKey }: { queryKey: QueryKey }) => {
		const [dhis2Instance] = queryKey;
		const query = new Parse.Query(clientClassName);
		query.equalTo("dhis2Instance", dhis2Instance);
		return query.find();
	};
}

const channels = [
	{
		name: "whatsapp",
		className: ParseClass.WHATSAPP_CLIENT,
	},
	{
		name: "telegram",
		className: ParseClass.TELEGRAM_CLIENT,
	},
];

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

	const { data, loading, error } = useMemo(() => {
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

	return {
		data,
		loading,
		error,
	};
}
