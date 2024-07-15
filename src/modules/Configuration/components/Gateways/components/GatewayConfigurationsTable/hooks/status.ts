import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useGatewayStatus({
	gateway,
	channel,
}: {
	gateway: Parse.Object;
	channel: string;
}) {
	const sessionId = useMemo(() => {
		return gateway.get("sessionId") as string;
	}, []);
	return useQuery({
		queryKey: [channel, sessionId],
		queryFn: async (): Promise<{ status: string } | null> => {
			const url = `${
				process.env.REACT_APP_SAAS_BASE_URL
			}/channels/${channel.toLowerCase()}/sessions/${sessionId}/status`;
			const response = await fetch(url, {
				headers: {},
			});
			if (response.status === 200) {
				return await response.json();
			}
			if (response.status === 500) {
				const error = await response.json();
				if (error.error.includes("Could not find active client")) {
					return {
						status: "NOT STARTED",
					};
				}
			}
			return null;
		},
		refetchInterval: 1000,
		refetchIntervalInBackground: 60 * 1000,
	});
}
