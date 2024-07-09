import React from "react";

import classes from "./Authentication.module.css";
import { ConnectionInstruction } from "./components/ConnectionInstruction";
import { AnalyticsRegistrationSvg } from "../../shared/components/Icons/Icons";

export function Authentication(): React.ReactElement {
	return (
		<div className="w-100 h-100 align-center justify-center p-32 column">
			<div className={classes["page-container"]}>
				<AnalyticsRegistrationSvg />
				<ConnectionInstruction />
			</div>
		</div>
	);
}
