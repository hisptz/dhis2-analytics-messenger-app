import React, { useMemo } from "react";
import { useDHIS2Users } from "../../../../../shared/hooks/users";
import { Contact } from "../../../../../shared/interfaces";
import { ContactChip } from "../../../../../shared/components/ContactChip";
import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { JobActionArea } from "../components/JobActionArea";
import { ParseClass } from "../../../../../shared/constants/parse";

export function usePushAnalyticsConfig() {
	const currentUser = Parse.User.current();
	const instanceId =
		currentUser?.attributes.authDataResponse.dhis2Auth.instance.objectId;
	const fetchData = async () => {
		const query = new Parse.Query(ParseClass.ANALYTICS_PUSH_JOB);
		query.equalTo("dhis2Instance", {
			__type: "Pointer",
			className: ParseClass.ANALYTICS_PUSH_JOB,
			objectId: instanceId,
		});
		return await query.find();
	};

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["analyticsJobs"],
		queryFn: fetchData,
	});

	const { loading: usersLoading } = useDHIS2Users();

	const configs = useMemo(() => {
		if (!data) return [] as Record<string, unknown>[];
		return data?.map((config, index) => {
			const contacts = config?.get("contacts");

			return {
				name: config?.get("name"),
				index: index + 1,
				contacts: (
					<div style={{ gap: 8, flexWrap: "wrap" }} className="row">
						{contacts?.map(({ identifier, ...rest }: Contact) => (
							<ContactChip
								key={`${identifier}-recipient`}
								identifier={identifier}
								{...rest}
							/>
						))}
					</div>
				),
				actions: (
					<JobActionArea
						key={`${config.id}-action-area`}
						config={config}
					/>
				),
			};
		});
	}, [data]);

	return {
		data: configs,
		loading: isLoading || usersLoading,
		refetch,
	};
}
