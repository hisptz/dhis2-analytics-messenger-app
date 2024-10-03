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
	const { startTime, endTime, status, trigger, logs } = analyticsLogs;
	const [showLogs, setShowLogs] = useState(false);

	const toggleLogs = () => {
		setShowLogs(!showLogs);
	};

	return (
		<div className="column">
			<div className="row pb-4">
				<span className="logs-label">{i18n.t("Started at")}</span>:
				&nbsp;&nbsp;
				<span>{startTime}</span>
			</div>
			<div className="row pb-4">
				<span className="logs-label">{i18n.t("Status")}</span>:
				&nbsp;&nbsp;
				<StatusLabel status={status} />
			</div>
			<div className="row pb-4">
				<span className="logs-label">{i18n.t("Trigger")}</span>:
				&nbsp;&nbsp;
				<span>{capitalize(trigger)}</span>
			</div>
			{endTime && endTime !== "N/A" && (
				<div className="row pb-4">
					<span className="logs-label">{i18n.t("Ended at")}</span>:
					&nbsp;&nbsp;
					<span>{endTime}</span>
				</div>
			)}
			{logs && (
				<div className="row pb-4">
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
				<div className="row pb-4">
					<TechnicalLog logs={logs} />
				</div>
			)}
		</div>
	);
}
