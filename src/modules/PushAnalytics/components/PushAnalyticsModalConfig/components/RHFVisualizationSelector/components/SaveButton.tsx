import React, { useCallback } from "react";
import i18n from "@dhis2/d2-i18n";
import { useFormContext } from "react-hook-form";
import { Button } from "@dhis2/ui";
import { VisualizationData } from "./VisualizationSelectorModal";

export type PushVisualizationConfiguration = {
	id: string;
	description?: string;
	type: "map" | "visualization";
};

export function SaveButton({
	onClose,
}: {
	onClose: (visualization?: PushVisualizationConfiguration) => void;
}) {
	const { handleSubmit, reset } = useFormContext<VisualizationData>();
	const onSaveVisulization = (data: VisualizationData) => {
		onClose({
			id: data.visualization,
			description: data.description,
			// TODO make this flexible to support maps also
			type: "visualization",
		});
		reset();
	};

	return (
		<Button primary onClick={() => handleSubmit(onSaveVisulization)()}>
			{i18n.t("Add")}
		</Button>
	);
}
