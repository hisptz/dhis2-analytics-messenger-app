import React from "react";
import i18n from "@dhis2/d2-i18n";
import classes from "../../Authentication.module.css";

export function AccountVerificationInstruction(): React.ReactElement {
	return (
		<div className="p-32">
			{i18n.t(
				"Check your email inbox to verify your account! If you haven't recived the email, contact",
			)}{" "}
			<span className={classes["link"]}>
				{i18n.t("dev@hisptanzania.org")}
			</span>
		</div>
	);
}
