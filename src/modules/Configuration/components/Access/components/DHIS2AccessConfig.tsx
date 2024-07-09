import React, { useCallback } from "react";
import { AccessConfigForm } from "../../../../../shared/components/AccessConfigForm";
import { useManageDHIS2Config } from "../../../../../shared/hooks/saveDHIS2Config";
import { useBoolean } from "usehooks-ts";
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";

export function DHIS2AccessConfig() {
	const {
		value: allowUpdate,
		setTrue: onUpdate,
		setFalse: onDisableUpdate,
	} = useBoolean(false);
	const { form, onSave } = useManageDHIS2Config({
		onClose: onDisableUpdate,
	});

	const onButtonClick = useCallback(() => {
		if (allowUpdate) {
			form.handleSubmit(onSave)();
		} else {
			onUpdate();
		}
	}, [allowUpdate]);

	const buttonLabel = allowUpdate ? i18n.t("Save Changes") : i18n.t("Update");

	return (
		<div
			style={{ minWidth: "fit-content", width: 400 }}
			className="column gap-16"
		>
			<AccessConfigForm editable={allowUpdate} form={form} />
			<div>
				<Button
					loading={form.formState.isSubmitting}
					onClick={onButtonClick}
				>
					{buttonLabel}
				</Button>
			</div>
		</div>
	);
}
