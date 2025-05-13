import React from "react";
import { Chip, Tooltip } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

interface VisualizationChipProps {
	visualization: string;
	description?: string;
	onRemove: () => void;
}

const query: any = {
	visualization: {
		resource: "dashboards",
		id: ({ id }: { id: string }) => id,
		params: {
			fields: ["id", "name"],
		},
	},
};

export function DashboardChip({
	visualization,
	description,
	onRemove,
}: VisualizationChipProps) {
	const { loading, error, data } = useDataQuery<any>(query, {
		variables: { id: visualization },
	});

	const sanitizedVisualiationLabel = loading
		? "..."
		: !error
			? data.visualization.name
			: visualization;

	return description ? (
		<Tooltip content={description}>
			<Chip onRemove={onRemove}>{sanitizedVisualiationLabel}</Chip>
		</Tooltip>
	) : (
		<Chip onRemove={onRemove}>{sanitizedVisualiationLabel}</Chip>
	);
}
