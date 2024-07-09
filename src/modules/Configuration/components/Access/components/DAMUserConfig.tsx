import React, { useCallback } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip } from "@dhis2/ui";
import { useBoolean } from "usehooks-ts";
import { useManageUser } from "../hooks/user";
import { DAMUserConfigForm } from "./DAMUserConfigForm";

export function DAMUserConfig() {
	const {
		value: allowUpdate,
		setTrue: onUpdate,
		setFalse: onDisableUpdate,
	} = useBoolean(false);

	const { onSave, form } = useManageUser({
		onComplete: onDisableUpdate,
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
			<DAMUserConfigForm editable={allowUpdate} form={form} />
			<ButtonStrip>
				<Button
					loading={form.formState.isSubmitting}
					onClick={onButtonClick}
				>
					{buttonLabel}
				</Button>
				<Button>{i18n.t("Change password")}</Button>
			</ButtonStrip>
		</div>
	);
}
