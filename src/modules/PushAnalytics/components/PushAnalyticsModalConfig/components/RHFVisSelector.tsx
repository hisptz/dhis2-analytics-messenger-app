import React, {useMemo} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {useGroups} from "./RHFGroupSelector";
import {useWatch} from "react-hook-form";
import {find} from "lodash";

export interface RHFVisSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}

export function RHFVisSelector({validations, name, label, required}: RHFVisSelectorProps) {
    const {data: groups, loading} = useGroups();

    const [selectedGroup] = useWatch({
        name: ['group']
    });

    const options = useMemo(() => {
        if (!selectedGroup) {
            return [];
        }
        const group = find(groups, ['id', selectedGroup]);

        return group?.visualizations?.map((vis: any) => ({label: vis.name, value: vis.id}))

    }, [groups, selectedGroup]);


    return (
        <RHFSingleSelectField
            loading={loading}
            required={required}
            validations={validations}
            label={label}
            options={options}
            name={name}
        />
    )
}
