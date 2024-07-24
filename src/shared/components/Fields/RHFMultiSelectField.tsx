import { Controller } from "react-hook-form";
import { MultiSelectField, MultiSelectOption } from "@dhis2/ui";
import React from "react";

export interface RHFMultiSelectFieldProps {
	validations?: Record<string, unknown>;
	name: string;
	label: string;
	options: { value: string; label: string }[];

	[x: string]: unknown;
}

export function RHFMultiSelectField({
	name,
	label,
	options,
	...props
}: RHFMultiSelectFieldProps) {
	return (
		<Controller
			render={({ field, fieldState }) => {
				return (
					<MultiSelectField
						{...props}
						filterable
						label={label}
						onChange={({ selected }: { selected: string[] }) => {
							field.onChange(
								selected?.map((sel) => {
									return sel;
								}),
							);
						}}
						selected={
							Array.isArray(field.value)
								? field.value.filter(
										(val) =>
											!!options.find(
												(option) =>
													option.value === val,
											),
									)
								: []
						}
						error={!!fieldState.error}
						validationText={fieldState.error?.message}
					>
						{options?.map(({ label, value }) => (
							<MultiSelectOption
								key={`${label}-${value}`}
								label={label}
								value={value}
							/>
						))}
					</MultiSelectField>
				);
			}}
			name={name}
		/>
	);
}
