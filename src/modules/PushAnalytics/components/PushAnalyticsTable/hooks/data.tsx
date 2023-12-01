import React, { useMemo } from "react";
import { useDHIS2Users } from "../../../../../shared/hooks/users";
import { Contact } from "../../../../../shared/interfaces";
import { ContactChip } from "../../../../../shared/components/ContactChip";
import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { JobActionArea } from "../components/JobActionArea";
import { ParseClass } from "../../../../../shared/constants/parse";
import { useParseLogin } from "../../../../../shared/components/ParseProvider";
import { logoutParseUser } from "../../../../../shared/utils/parse";

export function usePushAnalyticsConfig() {
	const loginParse = useParseLogin();
	const currentUser = Parse.User.current();
	const instanceId =
		currentUser?.attributes.authDataResponse.dhis2Auth.instance.objectId;

	async function fetchData(): Promise<Parse.Object[]> {
		try {
			const query = new Parse.Query(ParseClass.ANALYTICS_PUSH_JOB);
			query.equalTo("dhis2Instance", {
				__type: "Pointer",
				className: ParseClass.ANALYTICS_PUSH_JOB,
				objectId: instanceId,
			});
			return await query.find();
		} catch (e: Parse.Error | unknown) {
			const error = e as Parse.Error;
			if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
				//Refresh the user token by logging out and in again
				await logoutParseUser();
				await loginParse();
				return await fetchData();
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
