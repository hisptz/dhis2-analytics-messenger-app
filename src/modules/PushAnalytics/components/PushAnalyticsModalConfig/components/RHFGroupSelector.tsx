import React, {useMemo} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {ANALYTICS_GROUPS_DATASTORE_KEY} from "../../../../../shared/constants/dataStore";
import {useDataQuery} from "@dhis2/app-runtime";

export interface RHFGroupSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}

const groupQuery = {
    groups: {
        resource: `dataStore/${ANALYTICS_GROUPS_DATASTORE_KEY}`,
        params: {
            fields: [
                'id',
                'name',
                'visualizations'
            ]
        }
    }
}


export function useGroups() {
    const {data, loading} = useDataQuery(groupQuery);

    return {
        data: data?.groups?.entries,
        loading
    }
}


export function RHFGroupSelector({validations, name, label, required}: RHFGroupSelectorProps) {
    const {data: groups, loading} = useGroups();

    const options = useMemo(() => {
        return (groups as any)?.map((value: any) => ({
            label: value.name,
            value: value.id
        })) ?? []
    }, [groups]);

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
