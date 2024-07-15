import React from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
	const navigate = useNavigate();
	const onLogout = async () => {
		await Parse.User.logOut();
		navigate("/");
	};

	return (
		<div>
			<Button onClick={onLogout} destructive>
				{i18n.t("Disconnect from analytics messenger")}
			</Button>
		</div>
	);
}
