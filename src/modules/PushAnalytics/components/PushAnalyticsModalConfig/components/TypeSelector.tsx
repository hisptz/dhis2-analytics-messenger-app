import React, { useState } from "react";
import { SegmentedControl } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { RHFVisualizationSelector } from "./RHFVisualizationSelector/RHFVisualizationSelector";
import { RHFDashboardSelector } from "./RHFDashboardSelector/RHFDashboardSelector";
import { useFormContext } from "react-hook-form";
import { isEmpty } from "lodash";

type Values = "visualizations" | "dashboards";

export function TypeSelector() {
	const { getValues } = useFormContext();
	const [active, setActive] = useState<Values>(
		!isEmpty(getValues("dashboards")) ? "dashboards" : "visualizations",
	);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<SegmentedControl
					options={[
						{
							label: i18n.t("Visualizations"),
							value: "visualizations",
						},
						{
							label: i18n.t("Dashboards"),
							value: "dashboards",
						},
					]}
					selected={active}
					onChange={({ value }: { value: string }) =>
						setActive(value as Values)
					}
				/>
			</div>
			{active === "visualizations" && (
				<RHFVisualizationSelector
					label={i18n.t("Visualizations")}
					name="visualizations"
					required={true}
				/>
			)}
			{active === "dashboards" && (
				<RHFDashboardSelector
					name="dashboards"
					label={i18n.t("Dashboards")}
					required
				/>
			)}
		</div>
	);
}
