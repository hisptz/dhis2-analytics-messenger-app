import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Parse from "parse";

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
	const user = Parse.User.current();
	return useQuery({
		queryKey: [channel, sessionId],
		queryFn: async (): Promise<{ status: string } | null> => {
			const url = `${
				process.env.REACT_APP_SAAS_BASE_URL
			}/channels/${channel.toLowerCase()}/sessions/${sessionId}/status`;
			const response = await fetch(url, {
				headers: {
					"X-Parse-Session-Token": user!.getSessionToken()!,
					"X-Parse-Application-Id":
						process.env.REACT_APP_SAAS_APP_ID!,
				},
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
		refetchInterval: 10000,
		refetchIntervalInBackground: 60 * 60 * 1000,
	});
}
