import React, { useMemo } from "react";
import { sortBy } from "lodash";
import { useDHIS2Users } from "../../../../../shared/hooks/users";
import { Contact } from "../../../../../shared/interfaces";
import { ContactChip } from "../../../../../shared/components/ContactChip";
import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { JobActionArea } from "../components/JobActionArea";
import { ParseClass } from "../../../../../shared/constants/parse";
import { useDamConfig } from "../../../../../shared/components/DamConfigProvider";

export function usePushAnalyticsConfig() {
	const dhis2Instance = useDamConfig();

	async function fetchData(): Promise<Parse.Object[] | null> {
		try {
			if (dhis2Instance) {
				const query = new Parse.Query(ParseClass.ANALYTICS_PUSH_JOB);
				query.equalTo("dhis2Instance", dhis2Instance);
				return await query.find();
			} else {
				return null;
			}
		} catch (e: Parse.Error | unknown) {
			const error = e as Parse.Error;
			if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
				//Refresh the user token by logging out and in again
			}
			throw e;
		}
	}

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["analyticsJobs"],
		queryFn: fetchData,
	});

	const { loading: usersLoading } = useDHIS2Users();

	const configs = useMemo(() => {
		if (!data) return [] as Record<string, unknown>[];
		return sortBy(
			data?.map((config) => {
				const contacts = config?.get("contacts");
				return {
					name: config?.get("name"),
					contacts: (
						<div
							style={{ gap: 8, flexWrap: "wrap" }}
							className="row"
						>
							{contacts?.map(
								({ identifier, ...rest }: Contact) => (
									<ContactChip
										key={`${identifier}-recipient`}
										identifier={identifier}
										{...rest}
									/>
								),
							)}
						</div>
					),
					actions: (
						<JobActionArea
							key={`${config.id}-action-area`}
							config={config}
						/>
					),
				};
			}),
			["name"],
		).map((config, index) => ({ ...config, index: index + 1 }));
	}, [data]);

	return {
		data: configs,
		loading: isLoading || usersLoading,
		refetch,
	};
}
