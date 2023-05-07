import React, {useEffect, useState} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {useWatch} from "react-hook-form";
import {useSavedObject} from "@dhis2/app-service-datastore";
import axios from "axios"
import {find, head} from "lodash";

export interface RHFRecipientSelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}


async function getGroups(gateway: string): Promise<{ id: string, name: string }[]> {
    try {
        const response = await axios.get(`${gateway}/groups`,);
        if (response.status === 200) {
            return response.data.groups;
        } else {
            return []
        }
    } catch (e) {
        return [];
    }
}

export function RHFRecipientSelector({validations, name, label, required}: RHFRecipientSelectorProps) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<Array<{ label: string, value: string }>>([]);
    const [gateways] = useSavedObject(`gateways`);

    const [selectedGateway] = useWatch({
        name: ['gateway']
    });

    useEffect(() => {
        async function get() {
            if (selectedGateway) {
                const gateway = find(gateways as any[], ['id', selectedGateway]);
                if (!gateway) {
                    return;
                }
                const groups = await getGroups(gateway?.url);
                setOptions(groups?.map(({id, name}: any) => ({label: name, value: head(id.split('@')) ?? ''})) ?? [])
            }
        }

        get();
    }, [selectedGateway]);


    return (
        <RHFSingleSelectField
            required={required}
            validations={validations}
            label={label}
            options={options}
            name={name}
        />
    )
}

