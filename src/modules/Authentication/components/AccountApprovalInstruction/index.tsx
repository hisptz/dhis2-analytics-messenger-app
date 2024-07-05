import React from "react";
import i18n from "@dhis2/d2-i18n";
import classes from "../../Authentication.module.css";

export function AccountApprovalInstruction(): React.ReactElement {
	return (
		<div className="p-32">
			{i18n.t(
				"You will received the approval email soon! If it is taking too long, contact",
			)}{" "}
			<span className={classes["link"]}>
				{i18n.t("dev@hisptanzania.org")}
			</span>
		</div>
	);
}
