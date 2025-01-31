import { MultiSelectField, MultiSelectOption } from "@dhis2/ui";
import { RHFSingleSelectField } from "@hisptz/dhis2-ui";
import { find, intersectionWith, isEmpty } from "lodash";
import React, { useMemo } from "react";
import {
	ControllerFieldState,
	ControllerRenderProps,
	useWatch,
} from "react-hook-form";
import { useGroups } from "./RHFGroupSelector";

export function Field({
	field,
	fieldState,
	options,
	loading,
	required,
	label,
}: {
	label: string;
	field: ControllerRenderProps;
	fieldState: ControllerFieldState;
	options: Array<{ value: string; label: string }>;
	loading?: boolean;
	required?: boolean;
}) {
	const groupChanged = isEmpty(
		intersectionWith(field.value, options, (vis: any, option: any) => {
			return vis.id === option.value;
		}),
	);

	return (
		<MultiSelectField
			loading={loading}
			required={required}
			filterable
			label={label}
			onChange={({ selected }: { selected: string[] }) => {
				field.onChange(
					selected?.map((sel) => {
						const option = find(options, ["value", sel]);
						if (!option) {
							throw Error(`Could not select option ${sel}.`);
						}
						return {
							id: option.value,
							name: option.label,
						};
					}),
				);
			}}
			selected={
				groupChanged
					? []
					: (field.value?.map(({ id }: { id: string }) => id) ?? [])
			}
			error={!!fieldState.error}
			validationText={fieldState.error?.message}
		>
			{options?.map(({ label, value }: any) => (
				<MultiSelectOption
					key={`${label}-${value}`}
					label={label}
					value={value}
				/>
			))}
		</MultiSelectField>
	);
}

export interface RHFVisSelectorProps {
	name: string;
	validations?: Record<string, any>;
	label: string;
	required?: boolean;
}

export function RHFVisSelector({
	validations,
	name,
	label,
	required,
}: RHFVisSelectorProps) {
	const { data: groups, loading } = useGroups();

	const [selectedGroup] = useWatch({
		name: ["visualizationGroup"],
	});

	const group = useMemo(() => {
		return find(groups, ["id", selectedGroup]);
	}, [groups, selectedGroup]);

	const options = useMemo(() => {
		if (!group) {
			return [];
		}
		return (
			group?.visualizations?.map((vis: any) => ({
				label: vis.name,
				value: vis.id,
			})) ?? []
		);
	}, [group]);

	return (
		<RHFSingleSelectField
			loading={loading}
			required={required}
			validations={validations}
			label={label}
			options={options}
			name={name}
		/>
	);
}
