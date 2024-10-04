import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { capitalize } from "lodash";

import { TechnicalLog } from "../TechnicalLog";
import { JobStatus } from "../../../PushAnalyticsTable/components/JobStatus/hooks/data";
import "./AnalyticsLog.css";
import { StatusLabel } from "../../../PushAnalyticsTable/components/StatusLabel";

type AnalyticsLogsPros = {
	analyticsLogs: JobStatus;
};

export function AnalyticsLog({ analyticsLogs }: AnalyticsLogsPros) {
	const { startTime, status, trigger, logs, time } = analyticsLogs ?? {};
	const [showLogs, setShowLogs] = useState(false);

	const toggleLogs = () => {
		setShowLogs(!showLogs);
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "auto 1fr",
				gap: 8,
			}}
		>
			<span className="logs-label">{i18n.t("Started at")}:</span>
			<span>{startTime}</span>
			<span className="logs-label">{i18n.t("Status")}:</span>
			<StatusLabel status={status} />
			<span className="logs-label">{i18n.t("Trigger")}:</span>
			<span>{capitalize(trigger)}</span>
			{time && time !== "N/A" && (
				<>
					<span className="logs-label">{i18n.t("Time taken")}:</span>
					<span>{time}</span>
				</>
			)}
			{logs && (
				<div style={{ gridColumn: "1 / span 2" }} className="row pb-4">
					<small
						style={{
							textDecoration: "underline",
							cursor: "pointer",
						}}
						onClick={toggleLogs}
					>
						{showLogs ? i18n.t("Hide logs") : i18n.t("Show logs")}
					</small>
				</div>
			)}
			{showLogs && (
				<div
					style={{ gridColumn: "1 / span 2" }}
					className="row pb-4 w-100"
				>
					<TechnicalLog logs={logs} />
				</div>
			)}
		</div>
	);
}
