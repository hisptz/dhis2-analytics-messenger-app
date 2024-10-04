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
import { JobStatus } from "../components/JobStatus";

export function usePushAnalyticsConfig() {
	const dhis2Instance = useDamConfig();

	async function fetchData(): Promise<Parse.Object[] | null> {
		try {
			if (dhis2Instance) {
				const query = new Parse.Query(ParseClass.ANALYTICS_PUSH_JOB);
				query.equalTo("dhis2Instance", dhis2Instance);
				query.ascending("name");
				return await query.find();
			} else {
				return null;
			}
		} catch (e: Parse.Error | unknown) {
			const error = e as Parse.Error;
			if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
				// TODO: Refresh the user token by logging out and in again
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
							{contacts?.map((contact: Contact) => (
								<ContactChip
									key={`${contact.identifier}-${contact.gatewayId}-recipient`}
									contact={contact}
								/>
							))}
						</div>
					),
					status: <JobStatus job={config.id} />,
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
