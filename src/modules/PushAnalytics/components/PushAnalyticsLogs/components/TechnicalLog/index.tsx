import React from "react";
import "./TechnicalLog.css";

interface TechnicalLogProps {
	logs: string;
}
export function TechnicalLog({ logs }: TechnicalLogProps) {
	const logJson = JSON.parse(logs);
	return (
		<div style={{ width: "100%" }}>
			<pre className="terminal">{JSON.stringify(logJson, null, 2)}</pre>
		</div>
	);
}
