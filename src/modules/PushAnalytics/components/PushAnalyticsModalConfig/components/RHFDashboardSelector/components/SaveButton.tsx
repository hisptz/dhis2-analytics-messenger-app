import React from "react";
import i18n from "@dhis2/d2-i18n";
import { useFormContext } from "react-hook-form";
import { Button } from "@dhis2/ui";
import { DashboardData } from "./DashboardSelectorModal";

export type PushDashboardConfiguration = {
	id: string;
	description?: string;
	type: "map" | "visualization";
};

export function SaveButton({
	onClose,
}: {
	onClose: (visualization?: PushDashboardConfiguration) => void;
}) {
	const { handleSubmit, reset } = useFormContext<DashboardData>();
	const onSaveDashboard = (data: DashboardData) => {
		onClose({
			id: data.dashboard,
			description: data.description,
			// TODO make this flexible to support maps also
			type: "visualization",
		});
		reset();
	};

	return (
		<Button primary onClick={() => handleSubmit(onSaveDashboard)()}>
			{i18n.t("Add")}
		</Button>
	);
}
