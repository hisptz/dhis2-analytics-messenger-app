import {useWhatsappData} from "../../hooks/whatsapp";
import {find} from "lodash";
import {Chip, IconUser24, IconUserGroup24} from "@dhis2/ui";
import React from "react";
import {useDHIS2Users} from "../../hooks/users";

export interface ContactChipProps {
    number: string;
    type: "individual" | "group" | "user",
    onRemove?: () => void
}

export function ContactChip({type, number, onRemove}: ContactChipProps) {
    const {groups} = useWhatsappData();
    const {users} = useDHIS2Users();

    function getGroup(value: string) {
        return find(groups, ({id}: { id: string }) => id.includes(value))?.name ?? value;
    }

    function getUser(value: string) {
        return find(users, ({whatsApp}) => whatsApp.includes(value))?.displayName ?? value;
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

    return (
        <Chip
            onRemove={onRemove}
            icon={<IconUser24/>}>
            {getUser(number)}
        </Chip>
    )

}
