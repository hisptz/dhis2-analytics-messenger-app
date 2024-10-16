import React from "react";
import { Tooltip, Chip } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

interface VisualizationChipProps {
	visualization: string;
	description?: string;
	onRemove: () => void;
}

const query = {
	visualization: {
		resource: "visualizations",
		id: ({ id }: any) => id,
		params: {
			fields: ["id", "name"],
		},
	},
};

export function VisualizationChip({
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
