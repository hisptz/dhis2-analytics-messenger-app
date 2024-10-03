import React from "react";
import classNames from "classnames";
import { capitalize } from "lodash";
import "./StatusLabel.css";

interface StatusLabelProps {
	status?: string;
}

export function StatusLabel({ status }: StatusLabelProps) {
	const style = classNames({
		"not-available": !status,
		"initialized": status === "INITIALIZED",
		"completed": status === "COMPLETED",
		"failed": status === "FAILED",
	});
	return <span className={style}>{capitalize(status) || "N/A"}</span>;
}
