import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { RHFTextInputField } from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";
import { UserData } from "../hooks/user";

export interface DAMUserConfigFormProps {
	form: ReturnType<typeof useForm<UserData>>;
	editable: boolean;
}

export function DAMUserConfigForm({ form, editable }: DAMUserConfigFormProps) {
	return (
		<FormProvider {...form}>
			<div className="column gap-8">
				<RHFTextInputField
					disabled={!editable}
					type="text"
					name="fullName"
					label={i18n.t("Full Name")}
				/>
				<RHFTextInputField
					disabled={!editable}
					type="text"
					name="username"
					label={i18n.t("Username")}
				/>
				<RHFTextInputField
					disabled={!editable}
					type="email"
					name="email"
					label={i18n.t("Email")}
				/>
				<RHFTextInputField
					disabled={!editable}
					type="tel"
					name="phoneNumber"
					label={i18n.t("Phone Number")}
				/>
			</div>
		</FormProvider>
	);
}
