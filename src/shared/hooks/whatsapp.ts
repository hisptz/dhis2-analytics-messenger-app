import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Parse from "parse";

export function useWhatsappData() {
	const currentUser = Parse.User.current();
	const instanceId =
		currentUser?.attributes.authDataResponse?.dhis2Auth?.instance?.objectId;

	const getGroups = async () => {
		const response = await Parse.Cloud.run("getGroups", {
			instanceId,
		});
		return (response as Array<{ id: string; name: string }>) ?? null;
	};

	const { data, isLoading } = useQuery<Array<{ id: string; name: string }>>({
		queryKey: ["whatsapp", "groups"],
		queryFn: getGroups,
		retry: false,
	});

	const groups = useMemo(
		() =>
			data?.map((group) => ({
				...group,
				id: group.id.replace("@g.us", ""),
			})) ?? [],
		[data],
	);

	return {
		groups,
		loading: isLoading,
	};
}
