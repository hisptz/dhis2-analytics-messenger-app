import React, { useMemo } from "react";
import i18n from "@dhis2/d2-i18n";
import { RHFTextInputField } from "@hisptz/dhis2-ui";

export interface PhoneNumberProps {
	gatewayType: "whatsapp" | "telegram";
}

export function PhoneNumber({ gatewayType }: PhoneNumberProps) {
	const validations = useMemo(() => {
		switch (gatewayType) {
			case "telegram":
				return {};
			case "whatsapp":
				return {
					pattern: {
						value: /^\d{1,3}\d{9}$/,
						message: i18n.t("Invalid phone number"),
					},
				};
		}
	}, [gatewayType]);

	const label = useMemo(() => {
		switch (gatewayType) {
			case "telegram":
				return i18n.t("Phone Number / Username");
			case "whatsapp":
				return i18n.t("WhatsApp Phone Number");
		}
	}, [gatewayType]);

	const placeholder = useMemo(() => {
		switch (gatewayType) {
			case "telegram":
				return "";
			case "whatsapp":
				return "255XXXXXXXXX";
		}
	}, [gatewayType]);

	return (
		<RHFTextInputField
			placeholder={placeholder}
			validations={validations}
			label={label}
			name={"identifier"}
		/>
	);
}
