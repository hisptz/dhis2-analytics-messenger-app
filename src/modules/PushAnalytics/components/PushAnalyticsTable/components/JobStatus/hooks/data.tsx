import Parse from "parse";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ParseClass } from "../../../../../../../shared/constants/parse";
import { useInterval } from "usehooks-ts";
import { head, map } from "lodash";
import { DateTime, Interval } from "luxon";

export type JobStatus = {
	status: string;
	trigger: string;
	startTime: string;
	endTime?: string;
	logs: string;
	time?: string;
};

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

	const status: JobStatus[] = useMemo(() => {
		return map(data ?? [], (statusData) => {
			const startDate = new Date(statusData.get("startTime").toString());
			const endDate = statusData.get("endTime")
				? new Date(statusData.get("endTime").toString())
				: null;

			const startDateTime = DateTime.fromJSDate(startDate);
			const endDateTime = endDate
				? DateTime.fromJSDate(endDate)
				: undefined;

			const timeTaken = endDateTime
				? Interval.fromDateTimes(startDateTime, endDateTime)
				: undefined;

			return {
				status: statusData.get("status"),
				trigger: statusData.get("trigger"),
				startTime: startDateTime.toFormat("dd/MM/yyyy HH:mm:ss"),
				time: timeTaken?.toDuration().rescale().toHuman() ?? "N/A",
				endTime: endDateTime
					? endDateTime.toFormat("dd/MM/yyyy HH:mm:ss")
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
