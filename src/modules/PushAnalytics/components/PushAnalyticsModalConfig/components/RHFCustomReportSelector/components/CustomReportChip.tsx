import React from "react";
import { Chip, Tooltip } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

interface VisualizationChipProps {
	report: string;
	description?: string;
	onRemove: () => void;
}

const query: any = {
	report: {
		resource: "dataStore",
		id: ({ id }: { id: string }) => `hisptz-dam-custom-reports/${id}`,
	},
};

export function CustomReportChip({
	report,
	description,
	onRemove,
}: VisualizationChipProps) {
	const { loading, error, data } = useDataQuery<any>(query, {
		variables: { id: report },
	});

	const sanitizedVisualizationLabel = loading
		? "..."
		: !error
			? data.report.name
			: report;

	return description ? (
		<Tooltip content={description}>
			<Chip onRemove={onRemove}>{sanitizedVisualizationLabel}</Chip>
		</Tooltip>
	) : (
		<Chip onRemove={onRemove}>{sanitizedVisualizationLabel}</Chip>
	);
}
