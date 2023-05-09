import React, {useMemo} from "react";
import {useGroups} from "./RHFGroupSelector";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import {find, intersectionBy, isEmpty} from "lodash";
import {MultiSelectField, MultiSelectOption} from "@dhis2/ui";

export interface RHFVisSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}

export function RHFVisSelector({validations, name, label, required}: RHFVisSelectorProps) {
    const {data: groups, loading} = useGroups();
    const {setValue} = useFormContext();

    const [selectedGroup, visualizations] = useWatch({
        name: ['group', 'visualizations']
    });

    const options = useMemo(() => {
        if (!selectedGroup) {
            return [];
        }
        const group = find(groups, ['id', selectedGroup]);
        const visualizationOptions = group?.visualizations?.map((vis: any) => ({label: vis.name, value: vis.id})) ?? [];

        if (isEmpty(intersectionBy(visualizationOptions, visualizations, (option: any, vis: any) => option.value === vis?.id))) {
            setValue(`${name}`, [])
        }

        return visualizationOptions;
    }, [groups, selectedGroup]);

    return (
        <Controller
            rules={validations}
            render={
                ({field, fieldState, formState,}) => {

                    return (
                        <MultiSelectField
                            required={required}
                            filterable
                            label={label}
                            onChange={({selected}: { selected: string[] }) => {
                                field.onChange(selected?.map((sel) => {
                                    const option = find(options, ['value', sel]);
                                    return {
                                        id: option.value,
                                        name: option.label
                                    }
                                }))
                            }}
                            selected={field.value?.map(({id}: { id: string }) => id) ?? []}
                            error={!!fieldState.error}
                            validationText={fieldState.error?.message}
                        >
                            {
                                options?.map(({label, value}: any) => (
                                    <MultiSelectOption key={`${label}-${value}`} label={label} value={value}/>))
                            }
                        </MultiSelectField>
                    )
                }
            } name={name}/>
    )
}
