import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, Field, Help } from "@dhis2/ui";
import { Controller } from "react-hook-form";
import { DashboardSelectorModal } from "./components/DashboardSelectorModal";
import { uniqBy } from "lodash";
import { DashboardChip } from "./components/DashboardChip";
import { PushDashboardConfiguration } from "./components/SaveButton";

export interface RHFDashboardSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export const RHFDashboardSelector = ({
	name,
	validations,
	label,
	required,
}: RHFDashboardSelectorProps) => {
	const [showSelector, setShowSelector] = useState(false);

	return (
		<Controller
			name={name}
			rules={validations}
			render={({ field }) => {
				const selectedDashboards = field.value ?? [];
				return (
					<Field required={required} label={label}>
						<div className="column gap-16">
							<div
								style={{ flexWrap: "wrap", gap: 8 }}
								className="row"
							>
								{selectedDashboards.length ? (
									selectedDashboards.map(
										(
											visualizationData: PushDashboardConfiguration,
											index: number,
										) => (
											<DashboardChip
												key={`visualization-${index}`}
												visualization={
													visualizationData.id
												}
												description={
													visualizationData.description
												}
												onRemove={() => {
													field.onChange(
														selectedDashboards.filter(
															({
																id,
															}: {
																id: string;
															}) =>
																id !==
																visualizationData.id,
														),
													);
												}}
											/>
										),
									)
								) : (
									<Help>
										{i18n.t("No dashboards selected")}
									</Help>
								)}
							</div>
							<div style={{ maxWidth: "40%" }}>
								<Button onClick={() => setShowSelector(true)}>
									{i18n.t("Add Dashboards")}
								</Button>
							</div>
							{showSelector && (
								<DashboardSelectorModal
									hidden={!showSelector}
									onClose={(
										visualization?: PushDashboardConfiguration,
									) => {
										setShowSelector(false);
										if (visualization) {
											field.onChange(
												uniqBy(
													[
														...selectedDashboards,
														visualization,
													],
													"id",
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
