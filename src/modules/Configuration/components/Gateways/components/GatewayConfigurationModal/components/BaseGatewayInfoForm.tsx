import React from "react";
import { RHFSingleSelectField, RHFTextInputField } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import { channels } from "../../../constants/channels";

export function BaseGatewayInfoForm() {
	return (
		<div className="w-100 column gap-8">
			<RHFTextInputField required name="name" label={i18n.t("Name")} />
			<RHFSingleSelectField
				required
				label={i18n.t("Messaging channel")}
				options={channels.map(({ label, name }) => ({
					label,
					value: name,
				}))}
				name="channel"
			/>
		</div>
	);
}
