import React from "react";
import { CircularLoader } from "@dhis2/ui";
import classNames from "classnames";
import { useJobStatus } from "./hooks/data";
import "./JobStatus.css";
import { capitalize } from "lodash";

export interface JobStatusProps {
	job: string;
}

export function JobStatus({ job }: JobStatusProps) {
	const { currentStatus, isLoading } = useJobStatus(job);

	const chipStyle = classNames({
		"not-available": !currentStatus,
		"initialized": currentStatus?.status === "INITIALIZED",
		"completed": currentStatus?.status === "COMPLETED",
		"failed": currentStatus?.status === "FAILED",
	});

	return isLoading ? (
		<CircularLoader small />
	) : (
		<span className={chipStyle}>
			{capitalize(currentStatus?.status) || "N/A"}
		</span>
	);
}
