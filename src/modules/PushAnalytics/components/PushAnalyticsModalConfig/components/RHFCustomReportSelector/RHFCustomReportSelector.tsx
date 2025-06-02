import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Button, Field, Help } from "@dhis2/ui";
import { Controller } from "react-hook-form";
import { CustomReportChip } from "./components/CustomReportChip";
import { CustomReportSelectorModal } from "./components/CustomReportSelector";
import { uniqBy } from "lodash";

export interface RHFCustomReportSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export const RHFCustomReportSelector = ({
	name,
	validations,
	label,
	required,
}: RHFCustomReportSelectorProps) => {
	const [showSelector, setShowSelector] = useState(false);

	console.log(name, validations, label, required);

	return (
		<Controller
			name={name}
			rules={validations}
			render={({ field }) => {
				const selectedReports = field.value ?? [];

				return (
					<Field required={required} label={label}>
						<div className="column gap-16">
							<div
								style={{ flexWrap: "wrap", gap: 8 }}
								className="row"
							>
								{selectedReports.length ? (
									selectedReports.map(
										(
											report: {
												id: string;
												name: string;
												description?: string;
											},
											index: number,
										) => (
											<CustomReportChip
												key={`report-${index}`}
												report={report.id}
												description={report.description}
												onRemove={() => {
													field.onChange(
														selectedReports.filter(
															({
																id,
															}: {
																id: string;
															}) =>
																id !==
																report.id,
														),
													);
												}}
											></CustomReportChip>
										),
									)
								) : (
									<Help>
										{i18n.t("No custom reports selected")}
									</Help>
								)}
							</div>
							<div style={{ maxWidth: "40%" }}>
								<Button onClick={() => setShowSelector(true)}>
									{i18n.t("Add Custom Report")}
								</Button>
							</div>

							{showSelector && (
								<CustomReportSelectorModal
									hidden={!showSelector}
									onClose={(customReport) => {
										if (customReport) {
											field.onChange(
												uniqBy(
													[
														...selectedReports,
														customReport,
													],
													"id",
												),
											);
										}
										setShowSelector(false);
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
