import {useSavedObject} from "@dhis2/app-service-datastore";
import React, {useMemo} from "react";
import {RHFSingleSelectField} from "@hisptz/dhis2-ui";

export interface RHFGatewaySelectorProps {
    name: string;
    validations?: Record<string, any>;
    label: string;
    required?: boolean;
}


export function RHFGatewaySelector({validations, name, label, required}: RHFGatewaySelectorProps) {
    const [value] = useSavedObject('gateways');

    const options = useMemo(() => {
        return (value as any).map((value: any) => ({
            label: value.name,
            value: value.id
        }))
    }, [value]);

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
