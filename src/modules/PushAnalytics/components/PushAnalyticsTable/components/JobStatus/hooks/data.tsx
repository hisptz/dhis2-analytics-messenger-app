import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ParseClass } from "../../../../../../../shared/constants/parse";
import { useInterval } from "usehooks-ts";
import { map, head } from "lodash";
import { DateTime } from "luxon";

export function useJobStatus(jobId: string) {
	async function fetchJobStatus(): Promise<Parse.Object[] | null> {
		try {
			const query = new Parse.Query(ParseClass.ANALYTICS_PUSH_JOB_STATUS);
			query.equalTo("job", jobId);
			query.descending("createdAt");
			const results = await query.find();
			return results;
		} catch (e: Parse.Error | unknown) {
			const error = e as Parse.Error;
			if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
				// TODO: Refresh the user token by logging out and in again
			}
			console.error("Error fetching job status", e);
			throw e;
		}
	}

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["analyticsJobStatus", jobId],
		queryFn: fetchJobStatus,
	});

	const status = useMemo(() => {
		return map(data ?? [], (statusData) => {
			const startDate = new Date(statusData.get("startTime").toString());
			const endDate = statusData.get("endTime")
				? new Date(statusData.get("endTime").toString())
				: null;

			return {
				status: statusData.get("status"),
				startTime: DateTime.fromISO(startDate.toISOString()).toFormat(
					"dd/MM/yyyy HH:mm:ss",
				),
				endTime: endDate
					? DateTime.fromISO(endDate.toISOString()).toFormat(
							"dd/MM/yyyy HH:mm:ss",
						)
					: "N/A",
				logs: statusData.get("logs"),
			};
		});
	}, [data]);

	const refetchInterval = 1000 * 10;
	useInterval(() => {
		refetch();
	}, refetchInterval);

	return {
		data,
		allStatus: status,
		currentStatus: head(status),
		isLoading,
		refetch,
	};
}
