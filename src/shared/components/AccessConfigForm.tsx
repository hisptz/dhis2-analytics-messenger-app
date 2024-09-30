import React from "react";
import i18n from "@dhis2/d2-i18n";
import { FormProvider, useForm } from "react-hook-form";
import { RHFTextInputField } from "@hisptz/dhis2-ui";
import { AccessConfigData } from "../hooks/saveDHIS2Config";

export interface AccessConfigFormProps {
	form: ReturnType<typeof useForm<AccessConfigData>>;
	editable: boolean;
}

export function AccessConfigForm({
	form,
	editable = true,
}: AccessConfigFormProps) {
	return (
		<FormProvider {...form}>
			<div className="column gap-8">
				<RHFTextInputField
					required
					disabled={!editable}
					type="password"
					name="pat"
					label={i18n.t("Personal access token")}
				/>
				<RHFTextInputField
					required
					disabled={!editable}
					type="date"
					name="expiresOn"
					label={i18n.t("Expires on")}
				/>
			</div>
		</FormProvider>
	);
}
