import {useWhatsappData} from "../../hooks/whatsapp";
import {find} from "lodash";
import {Chip, IconUser24, IconUserGroup24, IconVisualizationSingleValue24} from "@dhis2/ui";
import React from "react";

export interface ContactChipProps {
    number: string;
    type: "individual" | "group" | "user",
    onRemove?: () => void
}

export function ContactChip({type, number, onRemove}: ContactChipProps) {
    const {groups} = useWhatsappData();

    function getGroup(value: string) {
        return find(groups, ({id}: { id: string }) => id.includes(value))?.name ?? value;
    }

    if (type === "group") {
        return (
            <Chip
                onRemove={onRemove}
                icon={<IconUserGroup24/>}>
                {getGroup(number)}
            </Chip>
        )
    }

    if (type === "individual") {
        return (
            <Chip
                onRemove={onRemove}
                icon={<IconVisualizationSingleValue24/>}>
                {number}
            </Chip>
        )
    }

    if (type === "user") {
        return (
            <Chip
                onRemove={onRemove}
                icon={<IconUser24/>}>
                {number}
            </Chip>
        )
    }

    return null;
}
