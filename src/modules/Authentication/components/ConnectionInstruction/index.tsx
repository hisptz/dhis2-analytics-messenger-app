import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import classes from "../../Authentication.module.css";
import { ConnectFormModal } from "../ConnectFormModal";
import { RegistrationFormModal } from "../RegistrationFormModal";

const connectAction = "CONNECT";
const registerAction = "REGISTER";

export function ConnectionInstruction(): React.ReactElement {
	const [action, setAction] = useState<string | null>(null);

	return (
		<div className="p-32">
			<div>
				{i18n.t(
					"Register or Connect your account to Analytics Messaging Service",
				)}
			</div>
			<div className="pt-16">
				<span
					className={classes["link"]}
					onClick={() => setAction(connectAction)}
				>
					{i18n.t("Connect")}
				</span>
				<span className={classes["link-separator"]}>|</span>
				<span
					className={classes["link"]}
					onClick={() => setAction(registerAction)}
				>
					{i18n.t("Register")}
				</span>
			</div>

			{action === connectAction && (
				<ConnectFormModal
					onClose={() => setAction(null)}
					hide={action !== connectAction}
				/>
			)}

			{action === registerAction && (
				<RegistrationFormModal
					onClose={() => setAction(null)}
					hide={action !== registerAction}
				/>
			)}
		</div>
	);
}
