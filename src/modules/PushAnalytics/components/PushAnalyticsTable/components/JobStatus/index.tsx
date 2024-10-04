import React from "react";
import { CircularLoader } from "@dhis2/ui";
import { useJobStatus } from "./hooks/data";
import { StatusLabel } from "../StatusLabel";

export interface JobStatusProps {
	job: string;
}

export function JobStatus({ job }: JobStatusProps) {
	const { currentStatus, isLoading } = useJobStatus(job);

	return isLoading ? (
		<CircularLoader small />
	) : (
		<StatusLabel status={currentStatus?.status} />
	);
}
