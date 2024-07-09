import { useQuery } from "@tanstack/react-query";

export function useGatewayStatus({
	gateway,
	channel,
}: {
	gateway: Parse.Object;
	channel: string;
}) {
	const sessionId = gateway.get("sessionId") as string;
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
	});
}
