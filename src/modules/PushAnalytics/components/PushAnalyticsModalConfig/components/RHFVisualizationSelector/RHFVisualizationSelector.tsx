import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, Field, Help } from "@dhis2/ui";
import { Controller } from "react-hook-form";
import {
	VisualizationData,
	VisualizationSelectorModal,
} from "./components/VisualizationSelectorModal";
import { uniqBy } from "lodash";

export interface RHFVisualizationSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export const RHFVisualizationSelector = ({
	name,
	validations,
	label,
	required,
}: RHFVisualizationSelectorProps) => {
	const [showSelector, setShowSelector] = useState(false);

	return (
		<Controller
			name={name}
			rules={validations}
			render={({ field }) => {
				const selectedVisualizations = field.value ?? [];
				return (
					<Field required={required} label={label}>
						<div className="column gap-16">
							<div
								style={{ flexWrap: "wrap", gap: 8 }}
								className="row"
							>
								{selectedVisualizations.length ? (
									<Help>
										{i18n.t("Visualizations chips here!")}
									</Help>
								) : (
									<Help>
										{i18n.t("No visualizations selected")}
									</Help>
								)}
							</div>
							<div style={{ maxWidth: "40%" }}>
								<Button onClick={() => setShowSelector(true)}>
									{i18n.t("Add Visualizations")}
								</Button>
							</div>
							{showSelector && (
								<VisualizationSelectorModal
									hidden={!showSelector}
									onClose={(
										visualization?: VisualizationData,
									) => {
										setShowSelector(false);
										console.log(visualization);
										if (visualization) {
											field.onChange(
												uniqBy(
													[
														...selectedVisualizations,
														visualization,
													],
													"visualization",
												),
											);
										}
									}}
								/>
							)}
						</div>
					</Field>
				);
			}}
		/>
	);
};
