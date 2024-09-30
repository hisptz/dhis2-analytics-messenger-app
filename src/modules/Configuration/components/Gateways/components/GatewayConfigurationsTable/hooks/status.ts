import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Parse from "parse";
import { SupportedChannels } from "../../../../../../../shared/interfaces";

export function useGatewayStatus({
	gateway,
	channel,
}: {
	gateway: Parse.Object;
	channel: SupportedChannels;
}) {
	const sessionId = useMemo(() => {
		return gateway.get("sessionId") as string;
	}, []);
	return useQuery({
		queryKey: [channel, sessionId],
		queryFn: async (): Promise<{
			status: string;
			error?: string;
		} | null> => {
			const taskRun = {
				channel,
				session: gateway.get("sessionId"),
			};
			return (await Parse.Cloud.run("getStatus", taskRun)) ?? null;
		},
		refetchInterval: 10000,
		refetchIntervalInBackground: 60 * 60 * 1000,
	});
}
