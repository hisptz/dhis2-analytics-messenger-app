import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { getChannelByClassName } from "../utils/channels";

export function useGatewayGroups({ gateway }: { gateway?: Parse.Object }) {
	async function getGroups(): Promise<Array<{
		id: string;
		name: string;
	}> | null> {
		if (!gateway) {
			return null;
		}
		const channelConfig = getChannelByClassName(gateway?.className);
		if (!channelConfig) {
			throw Error(
				"Invalid gateway. Please contact your administrator about this error",
			);
		}

		const config = {
			channel: channelConfig.id,
			session: gateway.get("sessionId"),
		};
		return (await Parse.Cloud.run("getGroups", config)) ?? null;
	}

	return useQuery({
		refetchIntervalInBackground: false,
		refetchInterval: false,
		retry: 2,
		queryKey: [gateway],
		queryFn: getGroups,
	});
}
