import React, { useCallback } from "react";
import i18n from "@dhis2/d2-i18n";
import { useFormContext } from "react-hook-form";
import { Button } from "@dhis2/ui";
import { VisualizationData } from "./VisualizationSelectorModal";

export function SaveButton({
	onClose,
}: {
	onClose: (visualization?: VisualizationData) => void;
}) {
	const { handleSubmit, reset } = useFormContext<VisualizationData>();
	const onSaveVisulization = (data: VisualizationData) => {
		onClose(data);
		reset();
	};

	return (
		<Button primary onClick={() => handleSubmit(onSaveVisulization)()}>
			{i18n.t("Add")}
		</Button>
	);
}
